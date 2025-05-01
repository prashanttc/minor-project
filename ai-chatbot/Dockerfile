# Use lightweight base image
FROM python:3.10-slim

# Install only essential dependencies
RUN apt-get update && apt-get install -y \
    git \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Enable memory-efficient build
RUN pip install --no-cache-dir -r requirements.txt