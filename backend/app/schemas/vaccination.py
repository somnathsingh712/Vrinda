from pydantic import BaseModel


class VaccinationCreate(BaseModel):
    animal_id: str
    vaccine_name: str
    date_given: str
    next_due_date: str
    veterinarian: str
    notes: str