from datetime import datetime, timezone


def create_animal_document(
    animal,
    created_by
):
    return {

        "name": animal.name,

        "species": animal.species,

        "breed": animal.breed,

        "gender": animal.gender,

        "age": animal.age,

        "weight": animal.weight,

        "color": animal.color,

        "vaccinated": animal.vaccinated,

        "sterilized": animal.sterilized,

        "health_status": animal.health_status,

        "diet": animal.diet,

        "location": animal.location,

        "description": animal.description,

        "image_url": animal.image_url,

        "created_by": created_by,

        "created_at": datetime.now(timezone.utc)
    }