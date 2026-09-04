import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Animal {
  _id: string;
  animal_id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  age: number;
  weight: number;
  color: string;
  health_status: string;
  diet: string;
  location: string;
  description: string;
  image_url: string;
}

function AnimalDetails() {
  const { animalId } = useParams();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimal();
  }, []);

  async function fetchAnimal() {
    try {
      const response = await api.get(`/animals/${animalId}`);
      setAnimal(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <h2 className="text-xl">
        Loading...
      </h2>
    );
  }

  if (!animal) {
    return (
      <h2 className="text-xl text-red-600">
        Animal not found.
      </h2>
    );
  }

  return (
    <div className="space-y-8">

      <div className="rounded-xl bg-white p-8 shadow">

        <h1 className="text-4xl font-bold">
          {animal.name}
        </h1>

        <p className="mt-2 text-gray-600">
          {animal.species} • {animal.breed}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500">Animal ID</p>
            <h3>{animal.animal_id}</h3>
          </div>

          <div>
            <p className="text-gray-500">Gender</p>
            <h3>{animal.gender}</h3>
          </div>

          <div>
            <p className="text-gray-500">Age</p>
            <h3>{animal.age} Years</h3>
          </div>

          <div>
            <p className="text-gray-500">Weight</p>
            <h3>{animal.weight} Kg</h3>
          </div>

          <div>
            <p className="text-gray-500">Color</p>
            <h3>{animal.color}</h3>
          </div>

          <div>
            <p className="text-gray-500">Health</p>
            <h3>{animal.health_status}</h3>
          </div>

          <div>
            <p className="text-gray-500">Diet</p>
            <h3>{animal.diet}</h3>
          </div>

          <div>
            <p className="text-gray-500">Location</p>
            <h3>{animal.location}</h3>
          </div>

        </div>

        <div className="mt-8">
          <p className="text-gray-500">
            Description
          </p>

          <p className="mt-2">
            {animal.description}
          </p>
        </div>

      </div>

    </div>
  );
}

export default AnimalDetails;