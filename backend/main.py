from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import chat_collection
from agent import agent_executor as agent
from langchain_core.messages import SystemMessage, HumanMessage
import uuid 
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: str = None

@app.post("/chat")
async def chat_with_agent(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())
    
    try:
        system_message = (
            "You are a friendly 'Discovery Buddy' for children. "
            "Explain complex topics using simple words and fun analogies. "
            "Always include emojis 🌟."
        )

        inputs = {
            "messages": [
                SystemMessage(content=system_message),
                HumanMessage(content=request.message)
            ]
        }

        config = {"configurable": {"thread_id": session_id}}

        result = agent.invoke(inputs, config)
        ai_response = result["messages"][-1].content

        chat_data = {
            "session_id": session_id,
            "user_message": request.message,
            "ai_response": ai_response,
            "timestamp": datetime.utcnow()
        }

        await chat_collection.insert_one(chat_data)

        return {"response": ai_response, "session_id": session_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def home():
    return {"message": "API is running 🚀"}