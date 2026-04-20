from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("MONGODB_DB_NAME")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DB_NAME]

print("MongoDB Connected ✅")