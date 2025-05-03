FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# FIX: install numpy explicitly
RUN pip install numpy

# Download model
RUN python -c "from huggingface_hub import hf_hub_download; \
    hf_hub_download(repo_id='TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF', \
    filename='tinyllama-1.1b-chat-v1.0.Q2_K.gguf', cache_dir='./models')"

COPY . /app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
