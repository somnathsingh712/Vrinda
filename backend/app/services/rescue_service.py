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