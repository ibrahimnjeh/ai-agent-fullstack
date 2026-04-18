import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# URL de connexion (locale par défaut)
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGODB_URL)
db = client.ai_agent_db  # Nom de ta base de données

# On récupère la collection pour l'historique des chats
chat_collection = db.get_collection("conversations")

async def check_db():
    try:
        await client.admin.command('ping')
        print("✅ Connexion MongoDB réussie !")
    except Exception as e:
        print(f"❌ Erreur MongoDB : {e}")