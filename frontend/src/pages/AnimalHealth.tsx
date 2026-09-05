import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Health Records
          </h1>

          <p className="mt-2 text-gray-600">
            Medical history of this animal
          </p>

        </div>

      </div>

      {loading ? (

        <p>Loading...</p>

      ) : records.length === 0 ? (

        <div className="rounded-xl border p-10 text-center">
          No health records found.
        </div>

      ) : (

        <div className="space-y-6">

          {records.map((record) => (

            <div
              key={record._id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >

              <h2 className="text-xl font-semibold">
                {record.condition}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {record.date}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">

                <div>
                  <p className="text-gray-500">
                    Treatment
                  </p>

                  <h3>{record.treatment}</h3>
                </div>

                <div>
                  <p className="text-gray-500">
                    Medicine
                  </p>

                  <h3>{record.medicine}</h3>
                </div>

                <div>
                  <p className="text-gray-500">
                    Doctor
                  </p>

                  <h3>{record.doctor}</h3>
                </div>

                <div>
                  <p className="text-gray-500">
                    Next Visit
                  </p>

                  <h3>{record.next_visit}</h3>
                </div>

              </div>

              <div className="mt-5">

                <p className="text-gray-500">
                  Notes
                </p>

                <p className="mt-2">
                  {record.notes}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

      <Link
        to={`/animals/${animalId}`}
        className="mt-8 inline-block rounded-lg bg-gray-900 px-5 py-3 text-white"
      >
        Back
      </Link>

    </div>
  );
}

export default AnimalHealth;