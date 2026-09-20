from datetime import datetime

from app.schemas.vaccination import VaccinationCreate


def create_vaccination_document(
    vaccination: VaccinationCreate,
    created_by: str,
    vaccination_id: str,
):
    return {
        "vaccination_id": vaccination_id,
        "animal_id": vaccination.animal_id,
        "vaccine_name": vaccination.vaccine_name,
        "date_given": vaccination.date_given,
        "next_due_date": vaccination.next_due_date,
        "veterinarian": vaccination.veterinarian,
        "notes": vaccination.notes,
        "created_by": created_by,
        "created_at": datetime.utcnow(),
    }