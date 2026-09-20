from datetime import datetime


def create_volunteer_document(
    volunteer,
    created_by: str,
    volunteer_id: str,
):
    return {
        "volunteer_id": volunteer_id,
        "name": volunteer.name,
        "phone": volunteer.phone,
        "email": volunteer.email,
        "location": volunteer.location,
        "availability": volunteer.availability,
        "skills": volunteer.skills,
        "status": volunteer.status,
        "created_by": created_by,
        "created_at": datetime.utcnow(),
    }