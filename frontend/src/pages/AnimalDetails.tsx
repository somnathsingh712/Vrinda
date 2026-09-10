import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

interface Animal {
  _id?: string;
  animal_id: string;
  name: string;
  species: string;
  breed: string;
  gender?: string;
  age?: number;
  weight?: number;
  color?: string;
  location: string;
  health_status: string;
  diet?: string;
  description?: string;
}

function AnimalDetails() {
  const { animalId } = useParams();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimal();
  }, [animalId]);

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
      <div className="rounded-xl bg-white p-8 shadow">
        Loading...
      </div>
    );
  }

  if (!animal || animal.message) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Animal not found.
      </div>
    );
  }

  return (
    <div>

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            {animal.name}
          </h1>

          <p className="mt-2 text-gray-500">
            {animal.species} • {animal.breed}
          </p>
        </div>

        <Link
          to="/animals"
          className="rounded-lg border px-5 py-3"
        >
          Back
        </Link>

      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500">Animal ID</p>
            <h3 className="font-semibold">
              {animal.animal_id}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Species</p>
            <h3>{animal.species}</h3>
          </div>

          <div>
            <p className="text-gray-500">Breed</p>
            <h3>{animal.breed}</h3>
          </div>

          <div>
            <p className="text-gray-500">Location</p>
            <h3>{animal.location}</h3>
          </div>

          <div>
            <p className="text-gray-500">Health Status</p>
            <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
              {animal.health_status}
            </span>
          </div>

          <div>
            <p className="text-gray-500">Gender</p>
            <h3>{animal.gender || "-"}</h3>
          </div>

          <div>
            <p className="text-gray-500">Age</p>
            <h3>
              {animal.age ? `${animal.age} years` : "-"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Weight</p>
            <h3>
              {animal.weight ? `${animal.weight} kg` : "-"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Color</p>
            <h3>{animal.color || "-"}</h3>
          </div>

          <div>
            <p className="text-gray-500">Diet</p>
            <h3>{animal.diet || "-"}</h3>
          </div>

        </div>

        <div className="mt-6">
          <p className="text-gray-500">
            Description
          </p>

          <p className="mt-2">
            {animal.description || "No description available."}
          </p>
        </div>

        <div className="mt-8 flex gap-4">

          <Link
            to={`/animals/${animal.animal_id}/health`}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            View Health Records
          </Link>

          <Link
            to={`/animals/${animal.animal_id}/health/add`}
            className="rounded-lg bg-green-600 px-5 py-3 text-white"
          >
            Add Health Record
          </Link>

        </div>

      </div>

    </div>
  );
}

export default AnimalDetails;