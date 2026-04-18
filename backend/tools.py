from langchain_community.tools import WikipediaQueryRun, DuckDuckGoSearchRun
from langchain_core.tools import Tool
from langchain_community.utilities import WikipediaAPIWrapper
from datetime import datetime


# ------------------ SEARCH TOOL ------------------
search = DuckDuckGoSearchRun()

def search_wrapper(query: str) -> str:
    """Search the web for information."""
    return search.run(query)

search_tool = Tool(
    name="search",
    func=search_wrapper,
    description="Search the web for information"
)

# ------------------ WIKIPEDIA TOOL ------------------
api_wrapper = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=200)

wiki_tool = WikipediaQueryRun(api_wrapper=api_wrapper)