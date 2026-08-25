import type { PredictionResult } from "@/types/prediction";

const CLASS_LABELS: Record<string, string> = {
  "defect-free": "Bebas cacat",
  "defect-hole": "Lubang",
  "defect-horizontal": "Garis horizontal",
  "defect-stain": "Noda",
  "defect-vertical": "Garis vertikal",
};

export default function ResultPanel({ result }: { result: PredictionResult }) {
  const isDefectFree = result.prediction.class === "defect-free";
  const confidencePct = (result.prediction.confidence * 100).toFixed(1);
  const label = CLASS_LABELS[result.prediction.class] ?? result.prediction.class;

  return (
    <div className="fade-up mt-6 overflow-hidden rounded-lg border border-hairline bg-panel">
      <div
        className={`flex items-center gap-3 border-b border-hairline px-5 py-4 ${
          isDefectFree ? "bg-ok-dim" : "bg-flaw-dim"
        }`}
      >
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            isDefectFree ? "bg-ok" : "bg-flaw"
          }`}
        />
        <p
          className={`font-display text-lg font-semibold tracking-tight ${
            isDefectFree ? "text-ok" : "text-flaw"
          }`}
        >
          {isDefectFree ? "OK — TIDAK ADA CACAT" : "CACAT TERDETEKSI"}
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-hairline">
        <div className="px-5 py-4">
          <p className="font-data text-[11px] uppercase tracking-[0.15em] text-cream-dim">
            Klasifikasi
          </p>
          <p className="mt-1 font-body text-base text-cream">{label}</p>
        </div>
        <div className="px-5 py-4">
          <p className="font-data text-[11px] uppercase tracking-[0.15em] text-cream-dim">
            Confidence
          </p>
          <p className="mt-1 font-data text-base text-cream">{confidencePct}%</p>
        </div>
      </div>

      <div className="border-t border-hairline px-5 py-3">
        <p className="font-data text-[11px] text-cream-dim">
          file: {result.filename}
        </p>
      </div>
    </div>
  );
}
