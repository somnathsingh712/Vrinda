from datetime import datetime

from app.database.connection import db


def create_rescue_request(request):
    return db.rescue_requests.insert_one(request)


def get_all_rescue_requests():
    return list(
        db.rescue_requests.find().sort(
            "created_at",
            -1
        )
    )


def accept_rescue_request(request_id: str):
    return db.rescue_requests.update_one(
        {
            "request_id": request_id,
            "status": "Pending"
        },
        {
            "$set": {
                "status": "Accepted"
            }
        }
    )


def assign_volunteer(
    request_id: str,
    volunteer_id: str,
):
    return db.rescue_requests.update_one(
        {
            "request_id": request_id,
            "status": {
                "$in": [
                    "Accepted",
                    "Pending"
                ]
            }
        },
        {
            "$set": {
                "assigned_volunteer": volunteer_id,
                "assigned_at": datetime.utcnow(),
                "status": "Assigned",
            }
        }
    )


def start_rescue(request_id: str):
    return db.rescue_requests.update_one(
        {
            "request_id": request_id,
            "status": "Assigned"
        },
        {
            "$set": {
                "status": "In Progress",
                "started_at": datetime.utcnow(),
            }
        }
    )


def complete_rescue(request_id: str):
    return db.rescue_requests.update_one(
        {
            "request_id": request_id,
            "status": "In Progress"
        },
        {
            "$set": {
                "status": "Completed",
                "completed_at": datetime.utcnow(),
            }
        }
    )