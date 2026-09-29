from fastapi import APIRouter, Depends

from app.schemas.health import HealthRecordCreate
from app.models.health import create_health_document

from app.services.health_service import (
    create_health_record,
    get_health_records,
    get_all_health_records,
)

from app.dependencies.auth import require_roles


router = APIRouter(
    prefix="/health",
    tags=["Health Records"],
)


@router.post("/")
def add_health_record(
    health: HealthRecordCreate,
    current_user=Depends(
        require_roles("veterinarian")
    ),
):
    health_document = create_health_document(
        health=health,
        created_by=current_user.get("email", "unknown"),
    )

    result = create_health_record(health_document)

    return {
        "message": "Health record added successfully",
        "record_id": str(result.inserted_id),
    }


@router.get("/all")
def list_all_health_records(
    current_user=Depends(require_roles(
        "citizen",
        "volunteer",
        "veterinarian",
        "ngo",
    )),
):
    records = get_all_health_records()

    for record in records:
        record["_id"] = str(record["_id"])

    return records


@router.get("/{animal_id}")
def list_health_records(
    animal_id: str,
    current_user=Depends(require_roles(
        "citizen",
        "volunteer",
        "veterinarian",
        "ngo",
    )),
):
    records = get_health_records(animal_id)

    for record in records:
        record["_id"] = str(record["_id"])

    return records