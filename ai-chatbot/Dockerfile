# Stage 1: Builder (for efficient layer caching)
FROM python:3.10-slim as builder

WORKDIR /app
COPY requirements.txt .

# Install system dependencies (required for some Python packages)
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    pip install --user -r requirements.txt && \
    apt-get remove -y gcc python3-dev && \
    apt-get autoremove -y

# Stage 2: Runtime
FROM python:3.10-slim

WORKDIR /app

# Copy Python dependencies from builder
COPY --from=builder /root/.local /root/.local
COPY . .

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

# Download models during build (optional)
 RUN python -c "from transformers import AutoModel; AutoModel.from_pretrained('microsoft/phi-3-mini-4k-instruct', cache_dir='/app/models')"

# Environment variables (can also pass at runtime)
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]