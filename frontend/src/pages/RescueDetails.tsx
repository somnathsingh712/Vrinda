import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

interface RescueRequest {
  request_id: string;
  reporter_name: string;
  phone: string;
  animal_type: string;
  description: string;
  location: string;
  urgency: string;
  status: string;
}

function RescueDetails() {
  const { requestId } = useParams();

  const [request, setRequest] = useState<RescueRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  async function fetchRequest() {
    try {
      const response = await api.get(`/rescue/${requestId}`);
      setRequest(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest() {
    if (!request) return;

    try {
      await api.put(`/rescue/${request.request_id}/accept`);

      alert("Request Accepted");

      fetchRequest();
    } catch (error) {
      console.error(error);
      alert("Unable to accept request.");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!request) {
    return <p>Request not found.</p>;
  }

  return (
    <div className="max-w-5xl">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Rescue Request
          </h1>

          <p className="mt-2 text-gray-500">
            {request.request_id}
          </p>
        </div>

        <Link
          to="/rescue"
          className="rounded-lg border px-5 py-3 hover:bg-gray-100"
        >
          Back
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-8 shadow-sm">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500">Reporter</p>
            <h3>{request.reporter_name}</h3>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <h3>{request.phone}</h3>
          </div>

          <div>
            <p className="text-gray-500">Animal Type</p>
            <h3>{request.animal_type}</h3>
          </div>

          <div>
            <p className="text-gray-500">Location</p>
            <h3>{request.location}</h3>
          </div>

          <div>
            <p className="text-gray-500">Urgency</p>
            <h3>{request.urgency}</h3>
          </div>

          <div>
            <p className="text-gray-500">Status</p>

            <span
              className={`rounded-full px-3 py-1 text-sm ${
                request.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : request.status === "Accepted"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {request.status}
            </span>
          </div>

        </div>

        <div className="mt-8">
          <p className="text-gray-500">
            Description
          </p>

          <p className="mt-2">
            {request.description}
          </p>
        </div>

        <div className="mt-8 flex gap-4">

          {request.status === "Pending" && (
            <button
              onClick={acceptRequest}
              className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
              Accept Request
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default RescueDetails;