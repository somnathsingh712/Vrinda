import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";

interface Vaccination {
  _id: string;
  vaccination_id: string;
  animal_id: string;
  vaccine_name: string;
  date_given: string;
  next_due_date: string;
  veterinarian: string;
  notes: string;
}

function AnimalVaccinations() {
  const { animalId } = useParams();

  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVaccinations();
  }, [animalId]);

  async function fetchVaccinations() {
    try {
      const response = await api.get(
        `/vaccinations/${animalId}`
      );

      setVaccinations(response.data);
    } catch (error) {
      console.error(
        "Error fetching vaccinations:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Vaccination Records
          </h1>

          <p className="mt-2 text-gray-600">
            Vaccination history of this animal
          </p>
        </div>

        <Link
          to="/vaccinations/add"
          className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Add Vaccination
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          Loading vaccination records...
        </div>
      ) : vaccinations.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">
            No Vaccination Records
          </h2>

          <p className="mt-3 text-gray-500">
            This animal does not have any vaccination
            records yet.
          </p>

          <Link
            to="/vaccinations/add"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800"
          >
            Add First Vaccination
          </Link>
        </div>
      ) : (
        /* Records */
        <div className="space-y-6">
          {vaccinations.map((vaccination) => (
            <div
              key={vaccination._id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {vaccination.vaccine_name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Vaccination ID:{" "}
                    {vaccination.vaccination_id}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  Vaccinated
                </span>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">
                    Date Given
                  </p>

                  <p className="mt-1 font-medium">
                    {vaccination.date_given}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Next Due Date
                  </p>

                  <p className="mt-1 font-medium">
                    {vaccination.next_due_date}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Veterinarian
                  </p>

                  <p className="mt-1 font-medium">
                    {vaccination.veterinarian}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  Notes
                </p>

                <p className="mt-2 leading-7">
                  {vaccination.notes ||
                    "No notes available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back */}
      <Link
        to={`/animals/${animalId}`}
        className="mt-8 inline-block rounded-lg bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800"
      >
        ← Back to Animal
      </Link>
    </div>
  );
}

export default AnimalVaccinations;