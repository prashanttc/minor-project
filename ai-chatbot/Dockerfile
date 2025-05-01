# Stage 1: Model downloader
FROM alpine:3.18 as model-downloader
RUN apk add --no-cache wget
RUN mkdir -p /models && \
    wget -q -P /models \
    https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0/resolve/main/model.safetensors \
    https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0/resolve/main/config.json \
    https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0/resolve/main/tokenizer.json

# Stage 2: Builder
FROM python:3.10-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Stage 3: Runtime
FROM python:3.10-slim
WORKDIR /app

# Copy dependencies
COPY --from=builder /root/.local /root/.local
COPY --from=model-downloader /models /app/models/tinyllama
COPY app /app

# Runtime config
ENV PATH=/root/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    TRANSFORMERS_CACHE=/app/models \
    HF_HOME=/app/models

    CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
