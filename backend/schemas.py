from pydantic import BaseModel
from typing import List

class DiscoveryResponse(BaseModel): 
    topic: str
    explanation: str  
    fun_fact: str     
    sources: List[str]
    suggested_questions: List[str] 