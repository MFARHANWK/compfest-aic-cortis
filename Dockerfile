# ─── Stage 1: Build Next.js Frontend ───────────────────────────────────────
FROM node:22-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Stage 2: Next.js Production Runner ─────────────────────────────────────
FROM node:22-slim AS frontend
WORKDIR /app
ENV NODE_ENV=production
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]

# ─── Stage 3: Python Backend ─────────────────────────────────────────────────
FROM python:3.12-slim AS backend
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y \
    libxcb1 \
    libglib2.0-0 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*
COPY . .
EXPOSE 5001
CMD ["python", "app.py"]