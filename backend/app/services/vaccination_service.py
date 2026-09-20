from app.database.connection import db


def create_vaccination(vaccination_document):
    return db.vaccinations.insert_one(
        vaccination_document
    )


def get_all_vaccinations():
    return list(
        db.vaccinations.find().sort(
            "created_at",
            -1
        )
    )


def get_vaccinations_by_animal(animal_id: str):
    return list(
        db.vaccinations.find(
            {
                "animal_id": animal_id
            }
        ).sort(
            "date_given",
            -1
        )
    )