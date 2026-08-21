// Mirrors the JSON contract returned by POST /predict in app.py:
//   { "filename": str, "prediction": { "class": str, "confidence": float } }
export type DefectClass =
  | "defect-free"
  | "defect-hole"
  | "defect-horizontal"
  | "defect-stain"
  | "defect-vertical";

export interface PredictionResult {
  filename: string;
  prediction: {
    class: DefectClass | string;
    confidence: number; // 0..1
  };
}

export interface ApiError {
  error: string;
}
