from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.animal import router as animal_router

from fastapi import Depends
from app.dependencies.auth import get_current_user

from app.database.connection import db
from app.routes.auth import router as auth_router

app = FastAPI(
    title="Vrinda API",
    version="1.0.0"
)

# Allow React frontend to access the backend
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all authentication routes
app.include_router(auth_router)
app.include_router(animal_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Vrinda"
    }


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

@app.get("/profile")
def profile(
    current_user=Depends(get_current_user)
):
    return {
        "message": "Welcome!",
        "user": current_user
    }