from pydantic import BaseModel


class HealthRecordCreate(BaseModel):
    animal_id: str
    date: str
    condition: str
    treatment: str
    medicine: str
    doctor: str
    next_visit: str
    notes: str