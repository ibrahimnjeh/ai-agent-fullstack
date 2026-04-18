import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver 
from langchain_core.messages import SystemMessage, HumanMessage
from tools import search_tool, wiki_tool
from schemas import DiscoveryResponse

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile")
structured_llm = llm.with_structured_output(DiscoveryResponse)

system_message = (
    "You are a friendly 'Discovery Buddy' for children. "
    "Explain complex topics using simple words and fun analogies. "
    "Always include emojis 🌟. Be patient, encouraging, and safe. "
    "If a topic is not suitable for kids, gently suggest learning about space or animals instead."
)

memory = MemorySaver()

tools = [search_tool, wiki_tool]
agent_executor = create_react_agent(
    model=llm,
    tools=tools,
    checkpointer=memory
)
def chat_with_agent(user_input: str, thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}
    response = agent_executor.invoke(
    {
        "messages": [
            SystemMessage(content=system_message),
            HumanMessage(content=user_input)
        ]
    },
    config
)
    
    return response["messages"][-1].content