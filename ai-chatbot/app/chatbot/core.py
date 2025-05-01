from sentence_transformers import SentenceTransformer
from .supabase import SupabaseManager
from llama_cpp import Llama

class ChatEngine:
    def __init__(self):
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.db = SupabaseManager()

        # Load GGUF LLM model using llama-cpp-python
        self.llm = Llama(
            model_path="/app/models/tinyllama/TinyLlama-1.1B-Chat-v1.0.Q4_K_M.gguf",
            n_ctx=2048,
            n_threads=4,        # Tune based on your Render CPU limits
            temperature=0.8,
            repeat_penalty=1.1,
            verbose=False
        )

    def generate_response(self, query: str) -> str:
        # Embed user query
        embedding = self.embedder.encode(query).tolist()
        books = self.db.search_books(embedding).data

        # Create prompt from books
        prompt = self._build_prompt(query, books)

        # Generate response using TinyLLaMA
        return self._generate_llm_response(prompt)

    def _build_prompt(self, query, books):
        context = "\n".join([
            f"Title: {b['title']}\nDescription: {b['description'][:150]}..."
            for b in books[:2]
        ])
        return f"<|system|>\nYou're a helpful bookstore assistant. Use this context:\n{context}\n\nAnswer in 1-2 friendly sentences. Avoid markdown.<|end|>\n<|user|>{query}<|end|>\n<|assistant|>"

    def _generate_llm_response(self, prompt):
        output = self.llm(
            prompt,
            max_tokens=100,
            stop=["<|end|>", "<|user|>"]
        )
        return output["choices"][0]["text"].strip()
