from datetime import datetime

from fastapi import APIRouter

from app.schemas.volunteer import VolunteerCreate
from app.models.volunteer import create_volunteer_document
from app.services.volunteer_service import (
    create_volunteer,
    get_all_volunteers,
    get_volunteer,
)

router = APIRouter(
    prefix="/volunteers",
    tags=["Volunteers"],
)


@router.post("/")
def add_volunteer(
    volunteer: VolunteerCreate,
):
    volunteer_id = (
        "VOL-"
        + datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    )

    document = create_volunteer_document(
        volunteer=volunteer,
        created_by="demo-user",
        volunteer_id=volunteer_id,
    )

    result = create_volunteer(document)

    return {
        "message": "Volunteer created successfully",
        "volunteer_id": volunteer_id,
        "database_id": str(result.inserted_id),
    }


@router.get("/")
def list_volunteers():

    volunteers = get_all_volunteers()

    for volunteer in volunteers:
        volunteer["_id"] = str(volunteer["_id"])

    return volunteers


@router.get("/{volunteer_id}")
def get_single_volunteer(
    volunteer_id: str,
):

    volunteer = get_volunteer(
        volunteer_id
    )

    if not volunteer:
        return {
            "message": "Volunteer not found"
        }

    volunteer["_id"] = str(
        volunteer["_id"]
    )

    return volunteer