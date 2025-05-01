# Stage 1: Download TinyLLaMA GGUF model
FROM alpine:3.18 as model-downloader

RUN apk add --no-cache wget
RUN mkdir -p /models/tinyllama

# Download the TinyLLaMA GGUF Q4_K_M model
RUN wget -q -O /models/tinyllama/TinyLlama-1.1B-Chat-v1.0.Q4_K_M.gguf \
    https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/TinyLlama-1.1B-Chat-v1.0.Q4_K_M.gguf

# Stage 2: Install Python dependencies
FROM python:3.10-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Stage 3: Runtime container
FROM python:3.10-slim

WORKDIR /app

# Copy model & app
COPY --from=model-downloader /models /app/models
COPY --from=builder /root/.local /root/.local
COPY app /app

# Runtime ENV
ENV PATH=/root/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
