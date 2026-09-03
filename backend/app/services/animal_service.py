from app.database.connection import db


def create_animal(document):
    return db.animals.insert_one(document)


def get_all_animals():
    return list(db.animals.find())