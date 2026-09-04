import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    fetchAnimals();
  }, []);

  async function fetchAnimals() {
    try {
      const response = await api.get("/animals/");
      setAnimals(response.data);
    } catch (error) {
      console.error("Error fetching animals:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Animals
        </h1>

        <p className="mt-2 text-gray-600">
          Registered animals in Vrinda
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">
            Loading animals...
          </p>
        </div>
      ) : animals.length === 0 ? (
        /* Empty State */
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">
            No animals registered
          </h2>

          <p className="mt-2 text-gray-500">
            Register your first animal to get started.
          </p>

          <Link
            to="/animals/register"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800"
          >
            Register Animal
          </Link>
        </div>
      ) : (
        /* Animal Table */
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Animal ID
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Name
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Species
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Breed
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Location
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Health
                </th>
              </tr>
            </thead>

            <tbody>
              {animals.map((animal) => (
                <tr
                  key={animal._id}
                  className="border-t transition hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-mono text-sm">
                    {animal.animal_id || "-"}
                  </td>

                  <td className="px-4 py-3 font-medium">
  <a
    href={`/animals/${animal.animal_id}`}
    className="text-blue-600 hover:underline"
  >
    {animal.name}
  </a>
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
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        animal.health_status === "Healthy"
                          ? "bg-green-100 text-green-700"
                          : animal.health_status === "Injured"
                          ? "bg-red-100 text-red-700"
                          : animal.health_status === "Under Treatment"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
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