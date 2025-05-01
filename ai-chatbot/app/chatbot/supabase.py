from supabase import create_client
import os
from dotenv import load_dotenv
import cachetools

load_dotenv()

# Cache results for 5 minutes
cache = cachetools.TTLCache(maxsize=100, ttl=300)

class SupabaseManager:
    def __init__(self):
        self.client = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_KEY")
        )
    
    @cachetools.cached(cache)
    async def search_books(self, embedding: list[float]):
        return self.client.rpc('search_books', {
            'query_embedding': embedding,
            'similarity_threshold': 0.7,
            'match_count': 3
        }).execute()