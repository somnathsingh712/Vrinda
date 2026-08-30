import os

from dotenv import load_dotenv
from pymongo import MongoClient

# Load variables from .env
load_dotenv()

# Read values from .env
MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Create MongoDB client
client = MongoClient(MONGODB_URI)

# Select database
db = client[DATABASE_NAME]

print("✅ Connected to MongoDB")