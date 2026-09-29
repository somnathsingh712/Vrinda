import os

import bcrypt
from jose import jwt
from datetime import datetime, timedelta


# ==========================================
# JWT CONFIGURATION
# ==========================================

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "vrinda-development-secret-key"
)

JWT_ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ==========================================
# PASSWORD HASHING
# ==========================================

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    """

    password_bytes = password.encode("utf-8")

    # bcrypt supports a maximum of 72 bytes.
    if len(password_bytes) > 72:
        raise ValueError(
            "Password cannot be longer than 72 bytes."
        )

    hashed_password = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    )

    return hashed_password.decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
    Verify a plain password against a bcrypt hash.
    """

    password_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")

    if len(password_bytes) > 72:
        return False

    return bcrypt.checkpw(
        password_bytes,
        hashed_bytes
    )


# ==========================================
# JWT ACCESS TOKEN
# ==========================================

def create_access_token(data: dict) -> str:
    """
    Create JWT access token.
    """

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )

    return encoded_jwt