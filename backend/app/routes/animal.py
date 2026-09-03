# from fastapi import APIRouter, Depends

# from app.schemas.animal import AnimalCreate
# from app.models.animal import create_animal_document
# from app.services.animal_service import (
#     create_animal,
#     get_all_animals
# )
# from app.dependencies.auth import get_current_user

# router = APIRouter(
#     prefix="/animals",
#     tags=["Animals"]
# )


# # @router.post("/")
# # def register_animal(
# #     animal: AnimalCreate,
# #     current_user=Depends(get_current_user)
# # ):

# @router.post("/")
# def register_animal(
#     animal: AnimalCreate
# ):
#     animal_document = create_animal_document(
#         animal=animal,
#         # created_by=current_user["sub"]
#         created_by="demo-user"
#     )

#     result = create_animal(animal_document)

#     return {
#         "message": "Animal registered successfully",
#         "animal_id": str(result.inserted_id)
#     }


# @router.get("/")
# def list_animals():
#     animals = get_all_animals()

#     for animal in animals:
#         animal["_id"] = str(animal["_id"])

#     return animals

from fastapi import APIRouter

from app.database.connection import db
from app.schemas.animal import AnimalCreate
from app.models.animal import create_animal_document
from app.services.animal_service import (
    create_animal,
    get_all_animals,
)

router = APIRouter(
    prefix="/animals",
    tags=["Animals"]
)


@router.post("/")
def register_animal(
    animal: AnimalCreate
):
    animal_document = create_animal_document(
        animal=animal,
        created_by="demo-user"
    )

    result = create_animal(animal_document)

    return {
        "message": "Animal registered successfully",
        "animal_id": animal_document["animal_id"],
        "database_id": str(result.inserted_id)
    }


@router.get("/")
def list_animals():
    animals = get_all_animals()

    for animal in animals:
        animal["_id"] = str(animal["_id"])

    return animals


@router.get("/{animal_id}")
def get_animal(animal_id: str):

    animal = db.animals.find_one(
        {
            "animal_id": animal_id
        }
    )

    if not animal:
        return {
            "message": "Animal not found"
        }

    animal["_id"] = str(animal["_id"])

    return animal