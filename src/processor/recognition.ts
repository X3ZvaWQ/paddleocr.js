import type * as ort from "onnxruntime-node";
import type { Box, RecognitionOptions } from "../interface";
import { DEFAULT_RECOGNITION_OPTIONS } from "../constants";
import { Image } from "../utils/image";

export interface RecognitionResult {
    text: string;
    box: Box;
    confidence: number;
}

export interface SingleRecognitionTask {
    index: number;
    image: Image;
    box: Box;
}

/**
 * Service for detecting and recognizing text in images
 */
export class RecognitionService {
    private readonly options: RecognitionOptions;
    private readonly session: ort.InferenceSession;
    private readonly ortModule: typeof ort;

    constructor(ortModule: typeof ort, session: ort.InferenceSession, options: Partial<RecognitionOptions> = {}) {
        this.session = session;
        this.ortModule = ortModule;

        this.options = {
            ...DEFAULT_RECOGNITION_OPTIONS,
            ...options,
        };
    }

    /**
     * Main method to run text recognition on an image with detected regions
     * @param image The original image buffer or image in Canvas
     * @param detection Array of bounding boxes from text detection
     * @returns Array of recognition results with text and bounding box, sorted in reading order
     */
    async run(image: Image, detection: Box[]): Promise<RecognitionResult[]> {
        const validBoxes = detection.filter((box) => box.width > 0 && box.height > 0);
        const results: RecognitionResult[] = [];
        for (const [i, box] of validBoxes.entries()) {
            const result = await this.processBox({
                image: image,
                index: i,
                box: box,
            });
            if (result) {
                results.push(result);
            }
        }
        return this.sortResultsByReadingOrder(results);
    }

    /**
     * Process a single text box
     */
    private async processBox(task: SingleRecognitionTask): Promise<RecognitionResult | null> {
        const { image, box } = task;

        const crop = image.crop(box);
        const resizedCrop = crop.resize({
            height: this.options.imageHeight!,
        });
        const tensor = resizedCrop.tensor({
            mean_values: this.options.mean!,
            norm_values: this.options.stdDeviation!,
        });

        const inputTensor = new this.ortModule.Tensor("float32", tensor, [1, 3, resizedCrop.height, resizedCrop.width]);
        const { data: outputData, dims: shape } = await this.runInference(inputTensor);

        const [, sequenceLength, numClasses] = shape;
        const { text: recognizedText, confidence } = this.ctcLabelDecode(
            outputData as Float32Array,
            sequenceLength,
            numClasses,
        );

        return { text: recognizedText, box, confidence };
    }

    /**
     * Sort recognition results by reading order (top to bottom, left to right)
     */
    private sortResultsByReadingOrder(results: RecognitionResult[]): RecognitionResult[] {
        return [...results].sort((a, b) => {
            const boxA = a.box;
            const boxB = b.box;

            // If boxes are roughly on the same line (within 1/4 of their combined heights)
            if (Math.abs(boxA.y - boxB.y) < (boxA.height + boxB.height) / 4) {
                return boxA.x - boxB.x; // Sort left to right
            }
            return boxA.y - boxB.y; // Otherwise sort top to bottom
        });
    }

    /**
     * Runs the ONNX inference session with the prepared tensor
     */
    private async runInference(inputTensor: ort.Tensor): Promise<ort.Tensor> {
        const feeds = { x: inputTensor };
        const results = await this.session.run(feeds);

        const outputNodeName = Object.keys(results)[0];
        const outputTensor = results[outputNodeName];

        if (!outputTensor) {
            throw new Error(
                `Recognition output tensor '${outputNodeName}' not found. Available keys: ${Object.keys(results)}`,
            );
        }

        return outputTensor;
    }

    private ctcLabelDecode(logits: Float32Array, sequenceLength: number, numClasses: number) {
        const dict = this.options.charactersDictionary!;
        let text = "";
        const scores = [];
        for (let t = 0; t < sequenceLength; t++) {
            let maxScore = 0;
            let maxScoreIndex = -1;
            for (let [index, score] of logits.slice(t * numClasses, (t + 1) * numClasses).entries()) {
                if (score > maxScore) {
                    maxScore = score;
                    maxScoreIndex = index;
                }
            }
            if (maxScoreIndex === 0) continue;
            const char = dict[maxScoreIndex] || "";
            text += char;
            scores.push(maxScore);
        }
        return {
            text,
            confidence: scores.reduce((sum, score) => sum + score, 0) / scores.length,
        };
    }
}
