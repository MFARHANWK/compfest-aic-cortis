# CORTIS — Fabric Defect Detection System
### COMPFEST 18 · AIC (AI Competition)

Sistem deteksi cacat kain (*fabric defect detection*) berbasis model YOLO, dengan backend Flask dan frontend Next.js.

---

## Daftar Isi
- [Prasyarat](#prasyarat)
- [Menjalankan dengan Docker (Direkomendasikan)](#menjalankan-dengan-docker-direkomendasikan)
- [Menjalankan Lokal tanpa Docker](#menjalankan-lokal-tanpa-docker)
- [Kontrak API](#kontrak-api)
- [Struktur Folder](#struktur-folder)

---

## Prasyarat

Pastikan sudah terinstall:

| Tools | Versi Minimum |
|---|---|
| [Docker](https://www.docker.com/get-started) | 24.x |
| [Docker Compose](https://docs.docker.com/compose/install/) | v2.x (sudah include di Docker Desktop) |

> **Catatan:** File model `models/best.pt` wajib ada sebelum menjalankan container.

---

## Menjalankan dengan Docker (Direkomendasikan)

### 1. Clone repository

```bash
git clone <url-repo>
cd AIC-Compfest
```

### 2. Pastikan model tersedia

```bash
ls models/best.pt   # harus ada file ini
```

### 3. Jalankan semua service sekaligus

```bash
docker compose up --build
```

Tunggu hingga muncul output seperti ini:

```
cortis-backend   |  * Running on http://0.0.0.0:5001
cortis-frontend  | ▲ Next.js — Ready on http://localhost:3000
```

### 4. Buka di browser

| Service | URL |
|---|---|
| Frontend (Web UI) | http://localhost:3000 |
| Backend API | http://localhost:5001 |

---

### Perintah Docker Compose Lainnya

```bash
# Jalankan di background (detached mode)
docker compose up --build -d

# Cek log semua service
docker compose logs -f

# Cek log salah satu service
docker compose logs -f backend
docker compose logs -f frontend

# Stop semua service
docker compose down

# Stop dan hapus semua data (image, volume)
docker compose down --rmi all --volumes
```

---

### Menjalankan Service Secara Terpisah (tanpa Compose)

Jika ingin menjalankan backend dan frontend secara manual menggunakan Docker:

#### Backend (Flask API)
```bash
# Build image backend
docker build --target backend -t cortis-backend .

# Jalankan container
docker run -p 5001:5001 \
  -v $(pwd)/models:/app/models \
  -v $(pwd)/uploads:/app/uploads \
  cortis-backend
```

#### Frontend (Next.js)
```bash
# Build image frontend
docker build --target frontend -t cortis-frontend .

# Jalankan container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:5001 \
  cortis-frontend
```

> **Perhatian:** Jika frontend & backend berjalan di container Docker yang berbeda (tanpa Compose), ganti `NEXT_PUBLIC_API_URL=http://localhost:5001` menjadi alamat IP mesin host, misalnya `http://host.docker.internal:5001` (macOS/Windows).

---

## Menjalankan Lokal tanpa Docker

### Backend (Flask + YOLO)

```bash
# Install dependencies Python
pip install -r requirements.txt

# Buat folder uploads
mkdir -p uploads

# Jalankan server
python app.py
# → berjalan di http://localhost:5001
```

### Frontend (Next.js)

```bash
# Install dependencies Node.js
npm install

# Salin dan sesuaikan env
cp .env.local.example .env.local

# Jalankan dev server
npm run dev
# → buka http://localhost:3000
```

---

## Kontrak API

| Endpoint | Method | Body | Response |
|---|---|---|---|
| `/health` | GET | — | `{ "status": "ok" }` |
| `/predict` | POST | `multipart/form-data`, field `image` | `{ "filename": str, "prediction": { "class": str, "confidence": float } }` |

Format gambar yang didukung: `.jpg`, `.jpeg`, `.png`

Error response: `{ "error": "..." }` dengan status `400`.

---

## Struktur Folder

```
AIC-Compfest/
├── app.py                  # Flask backend (YOLO inference)
├── requirements.txt        # Python dependencies
├── Dockerfile              # Multi-stage: frontend + backend
├── docker-compose.yml      # Orkestrasi kedua service
├── models/
│   └── best.pt             # Model YOLO (wajib ada)
├── uploads/                # Gambar yang diupload (auto-dibuat)
└── src/
    ├── app/
    │   ├── page.tsx        # Orkestrasi state: idle → loading → result
    │   ├── layout.tsx      # Font & metadata
    │   └── globals.css     # Design tokens
    ├── components/
    │   ├── Header.tsx      # Judul + indikator status backend
    │   ├── UploadPanel.tsx # Dropzone, preview, validasi, animasi scan
    │   └── ResultPanel.tsx # Tampilan hasil klasifikasi
    ├── lib/
    │   └── api.ts          # Fetch ke /predict dan /health
    └── types/
        └── prediction.ts   # Tipe data response backend
```
