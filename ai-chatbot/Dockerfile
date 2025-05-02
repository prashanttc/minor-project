FROM python:3.10-slim

WORKDIR /app

# Install system-level build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt

# Copy all code
COPY . .

# Entrypoint with dynamic port binding (for Render)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
