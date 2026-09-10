import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

interface Animal {
  _id: string;
  animal_id: string;
  name: string;
  species: string;
  breed: string;
  location: string;
  health_status: string;
}

function Animals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAnimals();
  }, []);

  async function fetchAnimals() {
    try {
      const response = await api.get("/animals/");
      setAnimals(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">
          Animals
        </h1>

        <p className="mt-2 text-gray-600">
          Registered animals in Vrinda
        </p>
      </div>

      {loading ? (
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          Loading...
        </div>
      ) : animals.length === 0 ? (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">
            No animals registered
          </h2>

          <p className="mt-2 text-gray-500">
            Register your first animal.
          </p>

          <Link
            to="/animals/register"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-white"
          >
            Register Animal
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Animal ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Species</th>
                <th className="px-4 py-3 text-left">Breed</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Health</th>
              </tr>
            </thead>

            <tbody>
              {animals.map((animal) => (
                <tr
                  key={animal._id}
                  onClick={() =>
                    navigate(`/animals/${animal.animal_id}`)
                  }
                  className="cursor-pointer border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-mono">
                    {animal.animal_id}
                  </td>

                  <td className="px-4 py-3">
                    {animal.name}
                  </td>

                  <td className="px-4 py-3">
                    {animal.species}
                  </td>

                  <td className="px-4 py-3">
                    {animal.breed}
                  </td>

                  <td className="px-4 py-3">
                    {animal.location}
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                      {animal.health_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Animals;