from datetime import datetime, timezone


def create_user_document(
    name: str,
    email: str,
    password: str,
    role: str
):
    return {
        "name": name,
        "email": email.lower(),
        "password": password,
        "role": role,
        "created_at": datetime.now(timezone.utc),
        "is_active": True
    }