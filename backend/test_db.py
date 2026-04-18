import asyncio
from database import chat_collection

async def test_connection():
    try:
        # Try to insert a dummy document
        test_doc = {"test": "connection", "status": "success"}
        result = await chat_collection.insert_one(test_doc)
        print(f"✅ Successfully connected! Document ID: {result.inserted_id}")
        
        # Try to find it back
        found = await chat_collection.find_one({"test": "connection"})
        print(f"🔍 Data retrieval check: {found['status']}")
        
        # Clean up
        await chat_collection.delete_one({"test": "connection"})
        print("🧹 Clean up complete.")
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())