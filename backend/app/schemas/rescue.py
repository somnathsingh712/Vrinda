from pydantic import BaseModel


class RescueRequestCreate(BaseModel):
    reporter_name: str
    phone: str
    animal_type: str
    description: str
    location: str
    urgency: str