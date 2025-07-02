export { PaddleOcrService, type FlattenedPaddleOcrResult, type PaddleOcrResult } from "./processor/paddle-ocr";

export type { Box, DetectionServiceOptions, PaddleOptions, RecognitionServiceOptions } from "./interface";

export { DetectionService, type PreprocessDetectionResult } from "./processor/detection";

export { RecognitionService, type RecognitionResult } from "./processor/recognition";

export { DEFAULT_DETECTION_OPTIONS, DEFAULT_PADDLE_OPTIONS, DEFAULT_RECOGNITION_OPTIONS } from "./constants";
