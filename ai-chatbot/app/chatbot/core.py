from sentence_transformers import SentenceTransformer
from .model_utils import load_quantized_model
from .supabase import SupabaseManager
import numpy as np

class ChatEngine:
    def __init__(self):
        # Load models in init to cache between requests
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.llm, self.tokenizer = load_quantized_model()
        self.db = SupabaseManager()
        self.convo_history = []
    
    async def generate_response(self, query: str):
        # Step 1: Get relevant books
        embedding = self.embedder.encode(query).tolist()
        books = await self.db.search_books(embedding)
        
        # Step 2: Format prompt with conversation history
        prompt = self._build_prompt(query, books.data)
        
        # Step 3: Generate response (streaming-ready)
        return await self._generate_llm_response(prompt)
    
    def _build_prompt(self, query, books):
        history = "\n".join([f"User: {q}\nBot: {r}" for q,r in self.convo_history[-3:]])
        book_context = "\n".join([f"- {b['title']}: {b['description'][:100]}" for b in books])
        
        return f"""<|system|>
        You're a bookstore assistant. Use this context:
        {book_context}
        
        Previous conversation:
        {history if history else 'No previous conversation'}
        
        Answer naturally in 1-2 short sentences.<|end|>
        <|user|>{query}<|end|>
        <|assistant|>"""
    
    async def _generate_llm_response(self, prompt):
        inputs = self.tokenizer(prompt, return_tensors="pt").to("cuda")
        outputs = self.llm.generate(
            **inputs,
            max_new_tokens=100,
            temperature=0.8,
            do_sample=True
        )
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True).split("<|assistant|>")[-1]