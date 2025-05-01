from transformers import AutoModelForCausalLM, AutoTokenizer
from pathlib import Path

def load_model():
    """Load the standard TinyLlama model without quantization"""
    model_path = Path("models/tinyllama")
    
    # No quantization config, just load the regular model
    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        device_map="auto",  # Automatically assigns model layers to devices (use CPU or GPU as available)
        local_files_only=True
    )
    
    tokenizer = AutoTokenizer.from_pretrained(
        model_path,
        use_fast=False
    )
    
    return model, tokenizer
