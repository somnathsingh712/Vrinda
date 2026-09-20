from pydantic import BaseModel


class VolunteerAssignment(BaseModel):
    volunteer_id: str