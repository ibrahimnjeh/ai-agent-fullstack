from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import chat_collection, db  # Ensure 'db' is imported to access users
from agent import agent_executor as agent
from langchain_core.messages import SystemMessage, HumanMessage
import uuid 
from datetime import datetime
from typing import Optional

app = FastAPI()

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class UserAuth(BaseModel):
    name: str
    pin: str
    avatar: Optional[str] = "🤖"

# --- Authentication Endpoints ---

@app.post("/signup")
async def signup(request: UserAuth):
    # Check if user already exists in MongoDB
    existing_user = await db.users_collection.find_one({"name": request.name})
    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="That name is already taken! Try a different explorer name. 🌈"
        )
    
    new_user = {
        "name": request.name,
        "pin": request.pin,
        "avatar": request.avatar,
        "created_at": datetime.utcnow()
    }
    
    await db.users_collection.insert_one(new_user)
    return {
        "status": "success", 
        "user": {"name": new_user["name"], "avatar": new_user["avatar"]}
    }

@app.post("/login")
async def login(request: UserAuth):
    # Find user by name
    user = await db.users_collection.find_one({"name": request.name})
    
    if not user:
        raise HTTPException(
            status_code=404, 
            detail="Explorer not found! Double check your name or Sign Up! 🚀"
        )
    
    # Check if PIN matches
    if user["pin"] != request.pin:
        raise HTTPException(
            status_code=401, 
            detail="Wrong Secret PIN! Try again. 🤫"
        )
    
    return {
        "status": "success", 
        "user": {"name": user["name"], "avatar": user.get("avatar", "🤖")}
    }

# --- Chat Logic Endpoints ---

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

        # Invoke the LangGraph agent
        result = agent.invoke(inputs, config)
        ai_response = result["messages"][-1].content

        # Save the conversation to MongoDB
        chat_data = {
            "session_id": session_id,
            "user_message": request.message,
            "ai_response": ai_response,
            "timestamp": datetime.utcnow()
        }

        await chat_collection.insert_one(chat_data)

        return {"response": ai_response, "session_id": session_id}

    except Exception as e:
        print(f"Error in /chat: {e}")
        raise HTTPException(status_code=500, detail="Buddy's brain is a bit tired. Try again!")

@app.get("/")
def home():
    return {"message": "Discovery Buddy API is running 🚀"}