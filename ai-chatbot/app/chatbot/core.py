from sentence_transformers import SentenceTransformer
from .model_utils import load_model
from .supabase import SupabaseManager

class ChatEngine:
    def __init__(self):
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.llm, self.tokenizer = load_model()
        self.db = SupabaseManager()
        self.history = []
    
    def generate_response(self, query: str):
        # Get book context
        embedding = self.embedder.encode(query).tolist()
        books = self.db.search_books(embedding).data
        
        # Generate prompt
        prompt = self._build_prompt(query, books)
        
        # Generate response
        return self._generate_llm_response(prompt)
    
    def _build_prompt(self, query, books):
        context = "\n".join([
            f"Title: {b['title']}\nDescription: {b['description'][:150]}..."
            for b in books[:2]
        ])
        
        return f"""<|system|>
        You're a helpful bookstore assistant. Use this context:
        {context}
        
        Answer in 1-2 friendly sentences. Avoid markdown.<|end|>
        <|user|>{query}<|end|>
        <|assistant|>"""
    
    def _generate_llm_response(self, prompt):
        inputs = self.tokenizer(prompt, return_tensors="pt").to("cuda")
        outputs = self.llm.generate(
            **inputs,
            max_new_tokens=100,
            temperature=0.8,
            repetition_penalty=1.1
        )
        return self.tokenizer.decode(
            outputs[0], 
            skip_special_tokens=True
        ).split("<|assistant|>")[-1].strip()