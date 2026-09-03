from pydantic import BaseModel, Field


class AnimalCreate(BaseModel):
    name: str = Field(min_length=2)

    species: str

    breed: str

    gender: str

    age: int

    weight: float

    color: str

    vaccinated: bool = False

    sterilized: bool = False

    health_status: str

    diet: str

    location: str

    description: str

    image_url: str = ""