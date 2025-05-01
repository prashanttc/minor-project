# Use a Python base image
FROM python:3.10-slim

# Set a working directory for the application
WORKDIR /app

# Install system dependencies (for any necessary tools like wget, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*


# Install Python dependencies (huggingface_hub for model downloading)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download the model during build
RUN python -c "from huggingface_hub import hf_hub_download; \
    hf_hub_download(repo_id='TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF', \
    filename='tinyllama-1.1b-chat-v1.0.Q2_K.gguf', cache_dir='./models')"

# Set the path for the application (where your app's code will go)
COPY . /app


CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
