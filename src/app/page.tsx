"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import UploadPanel, { validateFile } from "@/components/UploadPanel";
import ResultPanel from "@/components/ResultPanel";
import { ApiRequestError, predictDefect } from "@/lib/api";
import type { PredictionResult } from "@/types/prediction";

export type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Revoke object URLs when they're replaced/unmounted to avoid leaks.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleFileSelected(selected: File) {
    const problem = validateFile(selected);
    setValidationError(problem);
    setApiError(null);
    setResult(null);

    if (problem) {
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setStatus("loading");

    try {
      const prediction = await predictDefect(selected);
      setResult(prediction);
      setStatus("success");
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Terjadi kesalahan tak terduga. Coba lagi.";
      setApiError(message);
      setStatus("error");
    }
  }

  function handleReset() {
    setFile(null);
    setPreviewUrl(null);
    setStatus("idle");
    setResult(null);
    setValidationError(null);
    setApiError(null);
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <p className="max-w-xl font-body text-sm leading-relaxed text-cream-dim">
          Unggah satu sampel gambar kain. Model YOLO11 akan mengklasifikasikan
          apakah kain bebas cacat, atau menandai jenis cacat yang terdeteksi
          (lubang, noda, atau garis).
        </p>

        <div className="mt-8">
          <UploadPanel
            status={status}
            previewUrl={previewUrl}
            filename={file?.name ?? null}
            onFileSelected={handleFileSelected}
            onReset={handleReset}
            validationError={validationError}
          />
        </div>

        {status === "error" && apiError && (
          <div className="fade-up mt-6 rounded-lg border border-flaw-dim bg-flaw-dim px-5 py-4">
            <p className="font-data text-[11px] uppercase tracking-[0.15em] text-flaw">
              Analisis gagal
            </p>
            <p className="mt-1 font-body text-sm text-cream">{apiError}</p>
          </div>
        )}

        {status === "success" && result && <ResultPanel result={result} />}
      </main>

      <footer className="border-t border-hairline px-6 py-5">
        <p className="mx-auto max-w-3xl font-data text-[11px] text-cream-dim">
          CORTIS · Fabric Defect Detection System · COMPFEST 18 AIC
        </p>
      </footer>
    </>
  );
}
