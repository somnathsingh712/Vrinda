

# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# def root():
#     return {"message": "Welcome to Vrinda"}


# from app.database.connection import db
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# origins = [
#     "http://localhost:5173",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def root():
#     return {"message": "Welcome to Vrinda"}

from fastapi import FastAPI
from app.database.connection import db

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Welcome to Vrinda"}

@app.get("/test-db")
def test_db():
    result = db.test.insert_one(
        {
            "message": "MongoDB Connected",
            "project": "Vrinda"
        }
    )

    return {
        "status": "Success",
        "inserted_id": str(result.inserted_id)
    }