import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

interface Volunteer {
  _id: string;
  volunteer_id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  availability: string;
  skills: string;
  status: string;
}

function Volunteers() {
    const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  async function fetchVolunteers() {
    try {
      const response = await api.get("/volunteers/");
      setVolunteers(response.data);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
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
            Volunteers
          </h1>

          <p className="mt-2 text-gray-600">
            Manage volunteers registered with Vrinda.
          </p>
        </div>

        <Link
          to="/volunteers/new"
          className="rounded-lg bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800"
        >
          + Add Volunteer
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">
            Loading volunteers...
          </p>
        </div>
      ) : volunteers.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">
            No volunteers registered
          </h2>

          <p className="mt-2 text-gray-500">
            Add your first volunteer to get started.
          </p>

          <Link
            to="/volunteers/new"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800"
          >
            Add Volunteer
          </Link>
        </div>
      ) : (
        /* Volunteer Table */
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Volunteer ID
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Name
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Phone
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Location
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Availability
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Skills
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {volunteers.map((volunteer) => (
                <tr
  key={volunteer._id}
  onClick={() =>
    navigate(
      `/volunteers/${volunteer.volunteer_id}`
    )
  }
  className="cursor-pointer border-t transition hover:bg-gray-50"
>
                  <td className="px-4 py-3 font-mono text-sm">
                    {volunteer.volunteer_id}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {volunteer.name}
                  </td>

                  <td className="px-4 py-3">
                    {volunteer.phone}
                  </td>

                  <td className="px-4 py-3">
                    {volunteer.location}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        volunteer.availability === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {volunteer.availability}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {volunteer.skills}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        volunteer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {volunteer.status}
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

export default Volunteers;