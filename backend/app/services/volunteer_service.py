from app.database.connection import db


def create_volunteer(volunteer_document):
    return db.volunteers.insert_one(
        volunteer_document
    )


def get_all_volunteers():
    return list(
        db.volunteers.find().sort(
            "created_at",
            -1
        )
    )


def get_volunteer(volunteer_id: str):
    return db.volunteers.find_one(
        {
            "volunteer_id": volunteer_id
        }
    )


def assign_volunteer(volunteer_id: str):
    return db.volunteers.update_one(
        {
            "volunteer_id": volunteer_id,
            "status": "Active",
            "availability": "Available",
        },
        {
            "$set": {
                "availability": "Busy"
            }
        }
    )