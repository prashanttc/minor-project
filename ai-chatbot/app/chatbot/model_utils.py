from huggingface_hub import hf_hub_download
from llama_cpp import Llama
import os

def load_model():
    model_path = hf_hub_download(
        repo_id="TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF",
        filename="TinyLlama-1.1B-Chat-v1.0.Q4_K_M.gguf",
        cache_dir="./models"
    )

    llm = Llama(
        model_path=model_path,
        n_ctx=2048,
        n_threads=4,
        chat_format="chatml"  # or "llama-2" if needed
    )
    return llm
