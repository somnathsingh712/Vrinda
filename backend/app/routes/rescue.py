from fastapi import APIRouter

from app.schemas.rescue import RescueRequestCreate
from app.schemas.assignment import VolunteerAssignment

from app.models.rescue import create_rescue_document

from app.services.rescue_service import (
    create_rescue_request,
    get_all_rescue_requests,
    accept_rescue_request,
    assign_volunteer,
    start_rescue,
    complete_rescue,
)

from app.services.volunteer_service import (
    get_all_volunteers,
    get_volunteer,
    assign_volunteer as mark_volunteer_busy,
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

    result = accept_rescue_request(
        request_id
    )

    if result.matched_count == 0:
        return {
            "message": "Request not found or already processed"
        }

    return {
        "message": "Request accepted successfully"
    }


@router.get("/{request_id}/volunteers")
def get_available_volunteers(
    request_id: str,
):

    volunteers = get_all_volunteers()

    available_volunteers = []

    for volunteer in volunteers:

        if (
            volunteer.get("status") == "Active"
            and volunteer.get("availability") == "Available"
        ):
            volunteer["_id"] = str(
                volunteer["_id"]
            )

            available_volunteers.append(
                volunteer
            )

    return available_volunteers


@router.put("/{request_id}/assign")
def assign_request_volunteer(
    request_id: str,
    assignment: VolunteerAssignment,
):

    volunteer = get_volunteer(
        assignment.volunteer_id
    )

    if not volunteer:
        return {
            "message": "Volunteer not found"
        }

    if volunteer.get("status") != "Active":
        return {
            "message": "Volunteer is not active"
        }

    if volunteer.get("availability") != "Available":
        return {
            "message": "Volunteer is not available"
        }

    request_result = assign_volunteer(
        request_id=request_id,
        volunteer_id=assignment.volunteer_id,
    )

    if request_result.matched_count == 0:
        return {
            "message": "Rescue request not found or cannot be assigned"
        }

    volunteer_result = mark_volunteer_busy(
        assignment.volunteer_id
    )

    if volunteer_result.modified_count == 0:
        return {
            "message": "Volunteer could not be assigned"
        }

    return {
        "message": "Volunteer assigned successfully",
        "request_id": request_id,
        "volunteer_id": assignment.volunteer_id,
    }


@router.put("/{request_id}/start")
def start_rescue_request(
    request_id: str,
):

    result = start_rescue(
        request_id
    )

    if result.matched_count == 0:
        return {
            "message": "Request not found or not assigned"
        }

    return {
        "message": "Rescue started successfully"
    }


@router.put("/{request_id}/complete")
def complete_rescue_request(
    request_id: str,
):

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

    if request.get("status") != "In Progress":
        return {
            "message": "Rescue must be in progress before completion"
        }

    result = complete_rescue(
        request_id
    )

    if result.matched_count == 0:
        return {
            "message": "Unable to complete rescue"
        }

    volunteer_id = request.get(
        "assigned_volunteer"
    )

    if volunteer_id:

        db.volunteers.update_one(
            {
                "volunteer_id": volunteer_id
            },
            {
                "$set": {
                    "availability": "Available"
                }
            }
        )

    return {
        "message": "Rescue completed successfully",
        "volunteer_id": volunteer_id,
    }