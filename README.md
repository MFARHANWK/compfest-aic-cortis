# CORTIS — Frontend

Frontend Next.js (App Router + TypeScript + Tailwind) untuk Fabric Defect
Detection System, COMPFEST 18 AIC.

## Kontrak API (backend Flask)

| Endpoint   | Method | Body                                   | Response                                                              |
| ---------- | ------ | --------------------------------------- | ----------------------------------------------------------------------- |
| `/health`  | GET    | -                                       | `{ "status": "ok" }`                                                   |
| `/predict` | POST   | `multipart/form-data`, field `image`    | `{ "filename": str, "prediction": { "class": str, "confidence": float } }` |

Error response: `{ "error": "..." }` dengan status 400.

## Setup lokal

```bash
npm install
cp .env.local.example .env.local   # sesuaikan NEXT_PUBLIC_API_URL kalau perlu
npm run dev
```

Buka http://localhost:3000. Pastikan backend Flask jalan lebih dulu di
http://localhost:5001 (`python app.py` di folder backend).

## Build & jalankan production

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t cortis-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:5001 cortis-frontend
```

Catatan: kalau frontend & backend jalan sebagai container terpisah, pastikan
network Docker sama dan `NEXT_PUBLIC_API_URL` mengarah ke nama service
backend (misal `http://backend:5001`), bukan `localhost`.

## Struktur folder

```
src/
  app/
    page.tsx        # orkestrasi state: idle -> loading -> success/error
    layout.tsx       # font & metadata
    globals.css      # design tokens
  components/
    Header.tsx       # judul + indikator status backend (/health)
    UploadPanel.tsx   # dropzone, preview, validasi file, animasi scan
    ResultPanel.tsx   # tampilan hasil klasifikasi
  lib/
    api.ts           # fetch ke /predict dan /health
  types/
    prediction.ts    # tipe data sesuai response backend
```
