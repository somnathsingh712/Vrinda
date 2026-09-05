from datetime import datetime
from app.schemas.health import HealthRecordCreate


def create_health_document(
    health: HealthRecordCreate,
    created_by: str,
):
    return {
        "animal_id": health.animal_id,
        "date": health.date,
        "condition": health.condition,
        "treatment": health.treatment,
        "medicine": health.medicine,
        "doctor": health.doctor,
        "next_visit": health.next_visit,
        "notes": health.notes,
        "created_by": created_by,
        "created_at": datetime.utcnow(),
    }