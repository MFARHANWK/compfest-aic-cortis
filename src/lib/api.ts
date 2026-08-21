import type { ApiError, PredictionResult } from "@/types/prediction";

// Set NEXT_PUBLIC_API_URL in .env.local. Falls back to the backend's
// local dev port (see app.py: app.run(port=5001)).
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export class ApiRequestError extends Error {}

/**
 * POST an image to the /predict endpoint.
 * Backend expects multipart/form-data with the field name "image"
 * (see app.py: request.files["image"]).
 */
export async function predictDefect(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("image", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new ApiRequestError(
      "Tidak bisa menghubungi server. Pastikan backend berjalan di " +
        API_BASE_URL,
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data as ApiError | null)?.error ?? "Gagal memproses gambar.";
    throw new ApiRequestError(message);
  }

  return data as PredictionResult;
}

/** GET /health — used for the connection status indicator. */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}
