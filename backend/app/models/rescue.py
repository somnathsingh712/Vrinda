from datetime import datetime
import uuid

from app.schemas.rescue import RescueRequestCreate


def create_rescue_document(
    rescue: RescueRequestCreate,
    created_by: str,
):
    return {
        "request_id": f"RES-{uuid.uuid4().hex[:8].upper()}",
        "reporter_name": rescue.reporter_name,
        "phone": rescue.phone,
        "animal_type": rescue.animal_type,
        "description": rescue.description,
        "location": rescue.location,
        "urgency": rescue.urgency,
        "status": "Pending",
        "assigned_to": None,
        "created_by": created_by,
        "created_at": datetime.utcnow(),
    }