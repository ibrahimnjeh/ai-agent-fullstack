from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str 
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatSession(BaseModel):
    session_id: str
    messages: List[ChatMessage] = []