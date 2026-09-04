import { useEffect, useState } from "react";
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
      <h1 className="text-3xl font-bold">
        Animals
      </h1>

      <p className="mt-2 text-gray-600">
        Registered animals in Vrinda
      </p>

      {loading ? (
        <p className="mt-6">Loading...</p>
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
                  className="border-t"
                >
                  <td className="px-4 py-3">{animal.animal_id}</td>
                  <td className="px-4 py-3">{animal.name}</td>
                  <td className="px-4 py-3">{animal.species}</td>
                  <td className="px-4 py-3">{animal.breed}</td>
                  <td className="px-4 py-3">{animal.location}</td>
                  <td className="px-4 py-3">{animal.health_status}</td>
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