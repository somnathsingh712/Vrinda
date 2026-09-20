import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

interface RescueRequest {
  _id: string;
  request_id: string;
  reporter_name: string;
  animal_type: string;
  location: string;
  urgency: string;
  status: string;
  assigned_volunteer?: string;
}

function RescueRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState<RescueRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const response = await api.get(
        "/rescue/"
      );

      setRequests(response.data);
    } catch (error) {
      console.error(error);
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
            Rescue Requests
          </h1>

          <p className="mt-2 text-gray-600">
            Manage incoming rescue requests.
          </p>
        </div>

        <Link
          to="/rescue/new"
          className="rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700"
        >
          + New Request
        </Link>

      </div>


      {/* Loading */}

      {loading ? (

        <p>Loading...</p>

      ) : requests.length === 0 ? (

        <div className="rounded-xl border p-10 text-center">

          <h2 className="text-xl font-semibold">
            No rescue requests
          </h2>

          <p className="mt-2 text-gray-500">
            There are currently no rescue requests.
          </p>

        </div>

      ) : (

        /* Table */

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-4 py-3 text-left">
                  Request ID
                </th>

                <th className="px-4 py-3 text-left">
                  Reporter
                </th>

                <th className="px-4 py-3 text-left">
                  Animal
                </th>

                <th className="px-4 py-3 text-left">
                  Location
                </th>

                <th className="px-4 py-3 text-left">
                  Urgency
                </th>

                <th className="px-4 py-3 text-left">
                  Status
                </th>

                <th className="px-4 py-3 text-left">
                  Volunteer
                </th>

              </tr>

            </thead>


            <tbody>

              {requests.map((request) => (

                <tr
                  key={request._id}
                  onClick={() =>
                    navigate(
                      `/rescue/${request.request_id}`
                    )
                  }
                  className="cursor-pointer border-t transition hover:bg-gray-50"
                >

                  {/* Request ID */}

                  <td className="px-4 py-3 font-mono text-sm">
                    {request.request_id}
                  </td>


                  {/* Reporter */}

                  <td className="px-4 py-3">
                    {request.reporter_name}
                  </td>


                  {/* Animal */}

                  <td className="px-4 py-3">
                    {request.animal_type}
                  </td>


                  {/* Location */}

                  <td className="px-4 py-3">
                    {request.location}
                  </td>


                  {/* Urgency */}

                  <td className="px-4 py-3">

                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        request.urgency === "High"
                          ? "bg-red-100 text-red-700"
                          : request.urgency === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {request.urgency}
                    </span>

                  </td>


                  {/* Status */}

                  <td className="px-4 py-3">

                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        request.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : request.status === "Accepted"
                          ? "bg-blue-100 text-blue-700"
                          : request.status === "Assigned"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {request.status}
                    </span>

                  </td>


                  {/* Volunteer */}

                  <td className="px-4 py-3">

                    {request.assigned_volunteer ? (

                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        Assigned
                      </span>

                    ) : (

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                        Not Assigned
                      </span>

                    )}

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

export default RescueRequests;