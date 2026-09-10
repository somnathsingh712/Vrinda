from fastapi import APIRouter

from app.schemas.rescue import RescueRequestCreate
from app.models.rescue import create_rescue_document
from app.services.rescue_service import (
    create_rescue_request,
    get_all_rescue_requests,
    accept_rescue_request,
)
router = APIRouter(
    prefix="/rescue",
    tags=["Rescue Requests"],
)


@router.post("/")
def add_rescue_request(
    rescue: RescueRequestCreate,
):
    document = create_rescue_document(
        rescue=rescue,
        created_by="demo-user",
    )

    result = create_rescue_request(document)

    return {
        "message": "Rescue request created",
        "request_id": document["request_id"],
        "database_id": str(result.inserted_id),
    }


@router.get("/")
def list_rescue_requests():
    requests = get_all_rescue_requests()

    for request in requests:
        request["_id"] = str(request["_id"])

    return requests

@router.get("/{request_id}")
def get_rescue_request(request_id: str):

    from app.database.connection import db

    request = db.rescue_requests.find_one(
        {
            "request_id": request_id
        }
    )

    if not request:
        return {
            "message": "Rescue request not found"
        }

    request["_id"] = str(request["_id"])

    return request

@router.put("/{request_id}/accept")
def accept_request(request_id: str):

    result = accept_rescue_request(request_id)

    if result.matched_count == 0:
        return {
            "message": "Request not found"
        }

    return {
        "message": "Request accepted successfully"
    }