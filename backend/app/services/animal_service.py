from app.database.connection import db


def create_animal(animal_document):
    return db.animals.insert_one(animal_document)


def get_all_animals():
    return list(db.animals.find())


def get_animal_by_id(animal_id: str):
    return db.animals.find_one(
        {
            "animal_id": animal_id
        }
    )