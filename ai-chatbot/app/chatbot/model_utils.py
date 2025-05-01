from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import torch

def load_quantized_model():
    """4-bit quantized model loader for low memory usage"""
    quant_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16
    )
    
    model = AutoModelForCausalLM.from_pretrained(
        "models/phi-3-mini-4k-instruct",
        quantization_config=quant_config,
        device_map="auto",
        trust_remote_code=True
    )
    
    tokenizer = AutoTokenizer.from_pretrained(
        "models/phi-3-mini-4k-instruct"
    )
    
    return model, tokenizer