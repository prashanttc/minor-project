from fastapi import FastAPI, BackgroundTasks
from chatbot.core import ChatEngine
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()
chat_engine = ChatEngine()

@app.post("/chat")
async def chat_endpoint(query: str, background_tasks: BackgroundTasks):
    try:
        response = await chat_engine.generate_response(query)
        background_tasks.add_task(
            chat_engine.db.log_interaction,
            query, response
        )
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}