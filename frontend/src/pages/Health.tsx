import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

interface HealthRecord {
  _id: string;
  animal_id: string;
  date: string;
  condition: string;
  treatment: string;
  medicine: string;
  doctor: string;
  next_visit: string;
  notes: string;
}

function Health() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  async function fetchHealthRecords() {
    try {
      const response = await api.get("/health/all");

      setRecords(response.data);
    } catch (error) {
      console.error(
        "Error fetching health records:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Animal Health
        </h1>

        <p className="mt-2 text-gray-600">
          Monitor medical records and treatments across
          registered animals.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          Loading health records...
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Health Records
              </p>

              <p className="mt-2 text-3xl font-bold">
                {records.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Animals Treated
              </p>

              <p className="mt-2 text-3xl font-bold">
                {new Set(
                  records.map(
                    (record) => record.animal_id
                  )
                ).size}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Upcoming Visits
              </p>

              <p className="mt-2 text-3xl font-bold">
                {
                  records.filter(
                    (record) =>
                      record.next_visit &&
                      record.next_visit >=
                        new Date()
                          .toISOString()
                          .split("T")[0]
                  ).length
                }
              </p>
            </div>
          </div>

          {/* Records */}
          {records.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-semibold">
                No Health Records
              </h2>

              <p className="mt-3 text-gray-500">
                Health records will appear here once
                they are added to an animal.
              </p>

              <Link
                to="/animals"
                className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800"
              >
                View Animals
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Animal ID
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Date
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Condition
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Treatment
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Doctor
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Next Visit
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {records.map((record) => (
                      <tr
                        key={record._id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium">
                          {record.animal_id}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.date}
                        </td>

                        <td className="px-6 py-4">
                          {record.condition}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.treatment}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.doctor}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.next_visit || "-"}
                        </td>

                        <td className="px-6 py-4">
                          <Link
                            to={`/animals/${record.animal_id}/health`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Health;