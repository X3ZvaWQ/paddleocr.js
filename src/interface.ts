import type * as webOrt from "onnxruntime-web";
import type * as nodeOrt from "onnxruntime-node";

export interface ImageInput {
    width: number;
    height: number;
    data: Uint8Array;
}

/**
 * Parameters for the text detection service.
 */
export interface DetectionServiceOptions {
    padding?: number;

    /**
     * ArrayBuffer containing the ONNX model for text detection.
     */
    modelBuffer?: ArrayBuffer;

    /**
     * Per-channel mean values used to normalize input pixels [R, G, B].
     * @default [0.485, 0.456, 0.406]
     */
    mean?: [number, number, number];

    /**
     * Per-channel standard deviation values used to normalize input pixels [R, G, B].
     * @default [0.229, 0.224, 0.225]
     */
    stdDeviation?: [number, number, number];

    /**
     * Maximum dimension (longest side) for input images, in pixels.
     * Images above this size will be scaled down, maintaining aspect ratio.
     * @default 960
     */
    maxSideLength?: number;

    /**
     * Padding applied to each detected box vertical as a fraction of its height
     * @default 0.4
     */
    paddingBoxVertical?: number;

    /**
     * Padding applied to each detected box vertical as a fraction of its height
     * @default 0.6
     */
    paddingBoxHorizontal?: number;

    /**
     * Remove detected boxes with area below this threshold, in pixels.
     * @default 20
     */
    minimumAreaThreshold?: number;

    textPixelThreshold?: number;
}

/**
 * Parameters for the text recognition service.
 */
export interface RecognitionServiceOptions {
    /**
     * ArrayBuffer containing the ONNX model for text recognition.
     */
    modelBuffer?: ArrayBuffer;

    /**
     * Fixed height for input images, in pixels.
     * Models will resize width proportionally.
     * @default 48
     */
    imageHeight?: number;

    /**
     * Per-channel mean values used to normalize input pixels [R, G, B].
     * @default [0.485, 0.456, 0.406]
     */
    mean?: [number, number, number];

    /**
     * Per-channel standard deviation values used to normalize input pixels [R, G, B].
     * @default [0.229, 0.224, 0.225]
     */
    stdDeviation?: [number, number, number];

    /**
     * A list of loaded character dictionary (string) for
     * recognition result decoding.
     */
    charactersDictionary?: string[];
}

/**
 * Full configuration for the PaddleOCR service.
 * Combines model file paths with detection, recognition, and debugging parameters.
 */
export interface PaddleOptions {
    /**
     * onnxruntime module
     */
    ort?: typeof webOrt | typeof nodeOrt;

    /**
     * Controls parameters for text detection.
     */
    detection?: Partial<DetectionServiceOptions>;

    /**
     * Controls parameters for text recognition.
     */
    recognition?: Partial<RecognitionServiceOptions>;
}

/**
 * Options for each recognition task.
 */
export interface RecognitionOptions {
    flatten?: boolean;
    direct?: boolean;
    charWhiteList?: string[];
}

/**
 * Simple rectangle representation.
 */
export interface Box {
    /** X-coordinate of the top-left corner. */
    x: number;
    /** Y-coordinate of the top-left corner. */
    y: number;
    /** Width of the box in pixels. */
    width: number;
    /** Height of the box in pixels. */
    height: number;
}
