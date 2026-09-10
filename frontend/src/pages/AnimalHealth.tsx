import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";

interface HealthRecord {
  _id: string;
  date: string;
  condition: string;
  treatment: string;
  medicine: string;
  doctor: string;
  next_visit: string;
  notes: string;
}

function AnimalHealth() {
  const { animalId } = useParams();

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      const response = await api.get(`/health/${animalId}`);
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching health records:", error);
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
            Health Records
          </h1>

          <p className="mt-2 text-gray-600">
            Medical history of this animal
          </p>

        </div>

        <Link
          to={`/animals/${animalId}/health/add`}
          className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Add Record
        </Link>

      </div>

      {/* Loading */}
      {loading ? (

        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          Loading health records...
        </div>

      ) : records.length === 0 ? (

        /* Empty State */
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">

          <h2 className="text-2xl font-semibold">
            No Health Records
          </h2>

          <p className="mt-3 text-gray-500">
            This animal doesn't have any health records yet.
          </p>

          <Link
            to={`/animals/${animalId}/health/add`}
            className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800"
          >
            Add First Record
          </Link>

        </div>

      ) : (

        <div className="space-y-6">

          {records.map((record) => (

            <div
              key={record._id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-semibold">
                    {record.condition}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {record.date}
                  </p>

                </div>

              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">

                <div>

                  <p className="text-sm text-gray-500">
                    Treatment
                  </p>

                  <p className="mt-1 font-medium">
                    {record.treatment}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Medicine
                  </p>

                  <p className="mt-1 font-medium">
                    {record.medicine}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Doctor
                  </p>

                  <p className="mt-1 font-medium">
                    {record.doctor}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Next Visit
                  </p>

                  <p className="mt-1 font-medium">
                    {record.next_visit}
                  </p>

                </div>

              </div>

              <div className="mt-6">

                <p className="text-sm text-gray-500">
                  Notes
                </p>

                <p className="mt-2 leading-7">
                  {record.notes}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Back Button */}
      <Link
        to={`/animals/${animalId}`}
        className="mt-8 inline-block rounded-lg bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800"
      >
        ← Back to Animal
      </Link>

    </div>
  );
}

export default AnimalHealth;