from app.database.connection import db


def create_health_record(record):
    return db.health_records.insert_one(record)


def get_health_records(animal_id: str):
    return list(
        db.health_records.find(
            {
                "animal_id": animal_id
            }
        ).sort("created_at", -1)
    )



def get_all_health_records():
    return list(
        db.health_records.find().sort(
            "created_at",
            -1
        )
    )