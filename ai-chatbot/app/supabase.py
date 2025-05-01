from supabase import create_client
import os
import cachetools

cache = cachetools.TTLCache(maxsize=100, ttl=300)

class SupabaseManager:
    def __init__(self):
        self.client = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_KEY")
        )
    
    @cachetools.cached(cache)
    def search_books(self, embedding: list):
        return self.client.rpc('search_books', {
            'query_embedding': embedding,
            'similarity_threshold': 0.65,
            'match_count': 3
        }).execute()