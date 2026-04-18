from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import chat_with_agent
from fastapi import HTTPException

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatInput(BaseModel):
    message: str
    session_id: str

@app.post("/chat")
async def handle_chat(payload: ChatInput):
    try:
        ai_response = chat_with_agent(payload.message, payload.session_id)
        
        return {"reply": ai_response}
    
    except Exception as e:
        print(f"Internal Error: {e}")
        
        raise HTTPException(
            status_code=500, 
            detail="Oops! My robot brain is a bit tired right now. Can you try asking again? 🤖✨"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)