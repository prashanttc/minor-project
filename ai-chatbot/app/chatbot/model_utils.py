from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import torch
from pathlib import Path

def load_model():
    """Load 4-bit quantized TinyLlama model"""
    model_path = Path("models/tinyllama")
    
    quant_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=True
    )
    
    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        quantization_config=quant_config,
        device_map="auto",
        local_files_only=True
    )
    
    tokenizer = AutoTokenizer.from_pretrained(
        model_path,
        use_fast=False
    )
    
    return model, tokenizer