from datetime import datetime

from fastapi import APIRouter

from app.schemas.vaccination import VaccinationCreate
from app.models.vaccination import (
    create_vaccination_document,
)

from app.services.vaccination_service import (
    create_vaccination,
    get_all_vaccinations,
    get_vaccinations_by_animal,
)


router = APIRouter(
    prefix="/vaccinations",
    tags=["Vaccinations"],
)


@router.post("/")
def add_vaccination(
    vaccination: VaccinationCreate
):
    vaccination_id = (
        "VAC-"
        + datetime.utcnow().strftime(
            "%Y%m%d%H%M%S%f"
        )
    )

    document = create_vaccination_document(
        vaccination=vaccination,
        created_by="demo-user",
        vaccination_id=vaccination_id,
    )

    result = create_vaccination(document)

    return {
        "message": "Vaccination record added successfully",
        "vaccination_id": vaccination_id,
        "database_id": str(
            result.inserted_id
        ),
    }


@router.get("/")
def list_vaccinations():
    vaccinations = get_all_vaccinations()

    for vaccination in vaccinations:
        vaccination["_id"] = str(
            vaccination["_id"]
        )

    return vaccinations


@router.get("/{animal_id}")
def list_animal_vaccinations(
    animal_id: str
):
    vaccinations = get_vaccinations_by_animal(
        animal_id
    )

    for vaccination in vaccinations:
        vaccination["_id"] = str(
            vaccination["_id"]
        )

    return vaccinations