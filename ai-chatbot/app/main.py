from fastapi import FastAPI
from .core import ChatEngine

app = FastAPI()
chat_engine = ChatEngine()

@app.post("/chat")
async def chat(query: str):
    try:
        response = chat_engine.generate_response(query)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
def health_check():
    return {"status": "healthy"}