import { readFile } from "fs/promises";
import { PaddleOcrService } from "../src/index";
import * as ort from "onnxruntime-node";
import { decode } from "fast-png";

const imageFile = await readFile("tests/image.png");
const buffer = imageFile.buffer.slice(imageFile.byteOffset, imageFile.byteOffset + imageFile.byteLength);
const image = decode(buffer);
const input = {
    data: image.data,
    width: image.width,
    height: image.height,
};

const detectOnnx = await readFile("assets/PP-OCRv5_mobile_det_infer.onnx");
const recOnnx = await readFile("assets/PP-OCRv5_mobile_rec_infer.onnx");
const dict = await readFile("assets/ppocrv5_dict.txt", "utf-8").then((res) => res.split("\n"));

const paddleOcrService = await PaddleOcrService.createInstance({
    ort,
    detection: {
        modelBuffer: detectOnnx,
    },
    recognition: {
        modelBuffer: recOnnx,
        charactersDictionary: dict,
    },
    logging: {
        logging: console.log,
    },
});

const r = await paddleOcrService.recognize(input, {
    direct: true,
});
console.log(r);
