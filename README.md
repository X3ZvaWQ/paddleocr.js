# PaddleOcr

[中文文档 (Chinese Documentation)](./README_zh.md)

A lightweight, type-safe, dependency-free JavaScript/TypeScript library for PaddleOCR, supporting both Node.js and browser environments.

## Features

- **Cross-platform**: Works in Node.js, Bun, and browser environments.
- **Type-safe**: Written in TypeScript with full type definitions.
- **No dependencies**: Minimal footprint, no heavy image processing libraries included.
- **Flexible model loading**: Accepts model files as ArrayBuffer, allowing custom loading strategies (e.g., fetch, fs.readFileSync).
- **ONNX Runtime support**: Compatible with both `onnxruntime-web` and `onnxruntime-node`.
- **Customizable dictionary**: Pass your own character dictionary for recognition.
- **Modern API**: Simple, promise-based API for easy integration.

## Installation

```bash
npm install paddleocr
# or
yarn add paddleocr
# or
pnpm add paddleocr
```

## Usage

### 1. Prepare ONNX Runtime and Model Files

- In browser:
  ```js
  import * as ort from 'onnxruntime-web';
  ```
- In Node.js or Bun:
  ```js
  import * as ort from 'onnxruntime-node';
  ```

### 2. Load Model Files and Dictionary

You can use `fetch`, `fs.readFileSync`, or any other method to load your ONNX model files and dictionary as ArrayBuffer and string array, respectively.

### 3. Initialize the Service

```js
import { PaddleOcrService } from 'paddleocr';

const paddleOcrService = await PaddleOcrService.createInstance({
  ort,
  detection: {
    modelBuffer: detectOnnx,
  },
  recognition: {
    modelBuffer: recOnnx,
    charactersDictionary: dict,
  }
});
```

### 4. Prepare Image Data

The `recognize` method expects an object with `width`, `height`, and `data` (Uint8Array of RGB(A) values). Use your preferred image decoding library (e.g., `fast-png`, `image-js`).

```js
import { decode } from 'fast-png';
const imageFile = await readFile('tests/image.png');
const buffer = imageFile.buffer.slice(imageFile.byteOffset, imageFile.byteOffset + imageFile.byteLength);
const image = decode(buffer);
const input = {
  data: image.data,
  width: image.width,
  height: image.height,
};
```

### 5. Run OCR

```js
const result = await paddleOcrService.recognize(input);
console.log(result);
```

## Model Files

You can find sample models in the `assets/` directory:

- `PP-OCRv5_mobile_det_infer.onnx`
- `PP-OCRv5_mobile_rec_infer.onnx`
- `ppocrv5_dict.txt`

## Examples

See the `examples/` directory for usage samples.
About browser usage with Vite, check out [paddleocr-vite-example](https://github.com/X3ZvaWQ/paddleocr-vite-example)

## Contributing

Contributions are welcome! Feel free to submit a PR or open an issue.

## License

MIT
