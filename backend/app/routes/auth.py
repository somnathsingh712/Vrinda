from fastapi import APIRouter, HTTPException, status

from app.database.connection import db
from app.models.user import create_user_document
from app.schemas.user import UserRegister, UserLogin
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister):

    existing_user = db.users.find_one({
        "email": user.email.lower()
    })

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )

    allowed_roles = [
        "citizen",
        "volunteer",
        "veterinarian",
        "ngo"
    ]

    if user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user role"
        )

    hashed_password = hash_password(user.password)

    user_document = create_user_document(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role
    )

    result = db.users.insert_one(user_document)

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }


@router.post("/login")
def login_user(user: UserLogin):

    existing_user = db.users.find_one({
        "email": user.email.lower()
    })

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": str(existing_user["_id"]),
            "email": existing_user["email"],
            "role": existing_user["role"]
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }