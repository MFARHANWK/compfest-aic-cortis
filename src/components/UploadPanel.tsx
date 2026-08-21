"use client";

import { useCallback, useRef, useState } from "react";
import type { Status } from "@/app/page";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg"];

interface UploadPanelProps {
  status: Status;
  previewUrl: string | null;
  filename: string | null;
  onFileSelected: (file: File) => void;
  onReset: () => void;
  validationError: string | null;
}

export default function UploadPanel({
  status,
  previewUrl,
  filename,
  onFileSelected,
  onReset,
  validationError,
}: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      onFileSelected(file);
    },
    [onFileSelected],
  );

  const isBusy = status === "loading";
  const hasPreview = Boolean(previewUrl);

  return (
    <div className="fade-up">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isBusy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!isBusy) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !isBusy && !hasPreview && inputRef.current?.click()}
        className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border transition-colors sm:aspect-[16/9] ${
          dragging
            ? "border-teal bg-panel-raised"
            : "border-hairline bg-panel"
        } ${!hasPreview && !isBusy ? "cursor-pointer hover:border-teal-dim" : ""}`}
        style={{
          backgroundImage: !hasPreview
            ? "repeating-linear-gradient(45deg, rgba(237,230,216,0.035) 0, rgba(237,230,216,0.035) 1px, transparent 1px, transparent 10px)"
            : undefined,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {hasPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl!}
            alt={filename ?? "Pratinjau kain yang diunggah"}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="pointer-events-none flex flex-col items-center gap-2 px-6 text-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="text-cream-dim"
            >
              <path
                d="M12 16V4M12 4L7 9M12 4l5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-body text-sm text-cream-dim">
              Seret gambar kain ke sini, atau klik untuk memilih file
            </p>
            <p className="font-data text-[11px] text-cream-dim/70">
              PNG atau JPG · maks 5MB
            </p>
          </div>
        )}

        {isBusy && (
          <>
            <div className="absolute inset-0 bg-loom/45" />
            <div className="scan-line absolute left-0 h-[2px] w-full bg-teal shadow-[0_0_12px_2px_rgba(79,168,160,0.8)]" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-loom/80 px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />
              <span className="font-data text-[11px] text-cream">
                Menganalisis kain…
              </span>
            </div>
          </>
        )}
      </div>

      {validationError && (
        <p className="mt-3 font-data text-[12px] text-flaw">
          {validationError}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-data text-[12px] text-cream-dim">
          {filename ? filename : "Belum ada gambar dipilih"}
        </p>

        {hasPreview ? (
          <button
            type="button"
            onClick={onReset}
            disabled={isBusy}
            className="rounded-full border border-hairline px-4 py-1.5 font-body text-sm text-cream-dim transition-colors hover:border-teal-dim hover:text-cream disabled:opacity-40"
          >
            Ganti gambar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-teal px-4 py-1.5 font-body text-sm font-medium text-loom transition-opacity hover:opacity-90"
          >
            Pilih gambar
          </button>
        )}
      </div>
    </div>
  );
}

export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Format tidak didukung. Gunakan file PNG atau JPG.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "Ukuran file terlalu besar. Maksimal 5MB.";
  }
  return null;
}
