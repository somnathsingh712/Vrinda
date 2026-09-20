from pydantic import BaseModel, EmailStr


class VolunteerCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    location: str
    availability: str = "Available"
    skills: str
    status: str = "Active"