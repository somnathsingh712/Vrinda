from fastapi import APIRouter, HTTPException

from app.schemas.health import HealthRecordCreate
from app.models.health import create_health_document
from app.services.health_service import (
    create_health_record,
    get_health_records,
)

router = APIRouter(
    prefix="/health",
    tags=["Health Records"],
)


@router.post("/")
def add_health_record(
    health: HealthRecordCreate,
):
    health_document = create_health_document(
        health=health,
        created_by="demo-user",
    )

    result = create_health_record(health_document)

    return {
        "message": "Health record added successfully",
        "record_id": str(result.inserted_id),
    }


@router.get("/{animal_id}")
def list_health_records(animal_id: str):

    records = get_health_records(animal_id)

    for record in records:
        record["_id"] = str(record["_id"])

    return records