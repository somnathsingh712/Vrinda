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
  assigned_volunteer?: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
}

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

function RescueDetails() {
  const { requestId } = useParams();

  const [request, setRequest] =
    useState<RescueRequest | null>(null);

  const [volunteers, setVolunteers] =
    useState<Volunteer[]>([]);

  const [selectedVolunteer, setSelectedVolunteer] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [requestId]);

  async function fetchData() {
    try {
      const requestResponse = await api.get(
        `/rescue/${requestId}`
      );

      setRequest(requestResponse.data);

      const volunteerResponse = await api.get(
        `/rescue/${requestId}/volunteers`
      );

      setVolunteers(volunteerResponse.data);
    } catch (error) {
      console.error(
        "Error fetching rescue details:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest() {
    if (!request) return;

    setActionLoading(true);

    try {
      await api.put(
        `/rescue/${request.request_id}/accept`
      );

      alert("Request Accepted");
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Unable to accept request.");
    } finally {
      setActionLoading(false);
    }
  }

  async function assignVolunteer() {
    if (!request) return;

    if (!selectedVolunteer) {
      alert("Please select a volunteer.");
      return;
    }

    setAssigning(true);

    try {
      await api.put(
        `/rescue/${request.request_id}/assign`,
        {
          volunteer_id: selectedVolunteer,
        }
      );

      alert("Volunteer Assigned");

      setSelectedVolunteer("");

      fetchData();
    } catch (error) {
      console.error(error);
      alert("Unable to assign volunteer.");
    } finally {
      setAssigning(false);
    }
  }

  async function startRescue() {
    if (!request) return;

    setActionLoading(true);

    try {
      await api.put(
        `/rescue/${request.request_id}/start`
      );

      alert("Rescue Started");

      fetchData();
    } catch (error) {
      console.error(error);
      alert("Unable to start rescue.");
    } finally {
      setActionLoading(false);
    }
  }

  async function completeRescue() {
    if (!request) return;

    setActionLoading(true);

    try {
      await api.put(
        `/rescue/${request.request_id}/complete`
      );

      alert("Rescue Completed");

      fetchData();
    } catch (error) {
      console.error(error);
      alert("Unable to complete rescue.");
    } finally {
      setActionLoading(false);
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

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Rescue Request
          </h1>

          <p className="mt-2 font-mono text-gray-500">
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

      {/* Request Details */}
      <div className="rounded-xl border bg-white p-8 shadow-sm">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500">
              Reporter
            </p>

            <h3 className="mt-1 font-medium">
              {request.reporter_name}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Phone
            </p>

            <h3 className="mt-1">
              {request.phone}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Animal Type
            </p>

            <h3 className="mt-1">
              {request.animal_type}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Location
            </p>

            <h3 className="mt-1">
              {request.location}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Urgency
            </p>

            <h3 className="mt-1">
              {request.urgency}
            </h3>
          </div>

          {/* Status */}
          <div>
            <p className="text-gray-500">
              Status
            </p>

            <span
              className={`inline-block rounded-full px-3 py-1 text-sm ${
                request.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : request.status === "Accepted"
                  ? "bg-green-100 text-green-700"
                  : request.status === "Assigned"
                  ? "bg-blue-100 text-blue-700"
                  : request.status === "In Progress"
                  ? "bg-purple-100 text-purple-700"
                  : request.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {request.status}
            </span>
          </div>

          {/* Assigned Volunteer */}
          <div className="col-span-2">

            <p className="text-gray-500">
              Assigned Volunteer
            </p>

            <h3 className="mt-1">
              {request.assigned_volunteer ||
                "Not Assigned"}
            </h3>

            {request.assigned_at && (
              <p className="mt-1 text-sm text-gray-500">
                Assigned at:{" "}
                {new Date(
                  request.assigned_at
                ).toLocaleString()}
              </p>
            )}

          </div>

        </div>

        {/* Description */}
        <div className="mt-8">

          <p className="text-gray-500">
            Description
          </p>

          <p className="mt-2">
            {request.description}
          </p>

        </div>

        {/* Pending → Accept */}
        {request.status === "Pending" && (
          <div className="mt-8 border-t pt-8">

            <button
              onClick={acceptRequest}
              disabled={actionLoading}
              className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {actionLoading
                ? "Accepting..."
                : "Accept Request"}
            </button>

          </div>
        )}

        {/* Assigned → Start */}
        {request.status === "Assigned" && (
          <div className="mt-8 border-t pt-8">

            <button
              onClick={startRescue}
              disabled={actionLoading}
              className="rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {actionLoading
                ? "Starting..."
                : "Start Rescue"}
            </button>

          </div>
        )}

        {/* In Progress → Complete */}
        {request.status === "In Progress" && (
          <div className="mt-8 border-t pt-8">

            <button
              onClick={completeRescue}
              disabled={actionLoading}
              className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {actionLoading
                ? "Completing..."
                : "Complete Rescue"}
            </button>

          </div>
        )}

        {/* Completed */}
        {request.status === "Completed" && (
          <div className="mt-8 rounded-lg bg-green-50 p-6">

            <h3 className="text-lg font-semibold text-green-800">
              ✓ Rescue Completed
            </h3>

            {request.completed_at && (
              <p className="mt-2 text-sm text-green-700">
                Completed at:{" "}
                {new Date(
                  request.completed_at
                ).toLocaleString()}
              </p>
            )}

          </div>
        )}

      </div>

      {/* Volunteer Assignment */}
      {request.status === "Accepted" && (
        <div className="mt-8 rounded-xl border bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-semibold">
            Volunteer Assignment
          </h2>

          <p className="mt-2 text-gray-600">
            Select an available volunteer for this
            rescue request.
          </p>

          {volunteers.length === 0 ? (

            <div className="mt-6 rounded-lg bg-yellow-50 p-5">

              <p className="font-medium text-yellow-800">
                No available volunteers
              </p>

              <p className="mt-1 text-sm text-yellow-700">
                Please add an active and available
                volunteer before assigning this
                request.
              </p>

            </div>

          ) : (

            <div className="mt-6">

              <label className="mb-2 block text-sm font-medium">
                Select Volunteer
              </label>

              <select
                value={selectedVolunteer}
                onChange={(e) =>
                  setSelectedVolunteer(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-3"
              >

                <option value="">
                  Select an available volunteer
                </option>

                {volunteers.map((volunteer) => (
                  <option
                    key={volunteer.volunteer_id}
                    value={volunteer.volunteer_id}
                  >
                    {volunteer.name} —{" "}
                    {volunteer.location} —{" "}
                    {volunteer.skills}
                  </option>
                ))}

              </select>

              <button
                onClick={assignVolunteer}
                disabled={assigning}
                className="mt-5 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {assigning
                  ? "Assigning..."
                  : "Assign Volunteer"}
              </button>

            </div>

          )}

        </div>
      )}

      {/* Rescue Timeline */}
      <div className="mt-8 rounded-xl border bg-white p-8 shadow-sm">

        <h2 className="text-2xl font-semibold">
          Rescue Timeline
        </h2>

        <div className="mt-6 space-y-5">

          <div className="flex items-start gap-4">

            <div className="mt-1 h-3 w-3 rounded-full bg-yellow-500" />

            <div>
              <p className="font-medium">
                Request Created
              </p>

              <p className="text-sm text-gray-500">
                Rescue request was submitted.
              </p>
            </div>

          </div>

          {request.status !== "Pending" && (
            <div className="flex items-start gap-4">

              <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />

              <div>
                <p className="font-medium">
                  Request Accepted
                </p>

                <p className="text-sm text-gray-500">
                  Rescue request was accepted.
                </p>
              </div>

            </div>
          )}

          {request.assigned_volunteer && (
            <div className="flex items-start gap-4">

              <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />

              <div>
                <p className="font-medium">
                  Volunteer Assigned
                </p>

                <p className="text-sm text-gray-500">
                  Volunteer ID:{" "}
                  {request.assigned_volunteer}
                </p>

                {request.assigned_at && (
                  <p className="text-sm text-gray-500">
                    {new Date(
                      request.assigned_at
                    ).toLocaleString()}
                  </p>
                )}
              </div>

            </div>
          )}

          {request.started_at && (
            <div className="flex items-start gap-4">

              <div className="mt-1 h-3 w-3 rounded-full bg-purple-500" />

              <div>
                <p className="font-medium">
                  Rescue Started
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(
                    request.started_at
                  ).toLocaleString()}
                </p>
              </div>

            </div>
          )}

          {request.completed_at && (
            <div className="flex items-start gap-4">

              <div className="mt-1 h-3 w-3 rounded-full bg-green-600" />

              <div>
                <p className="font-medium">
                  Rescue Completed
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(
                    request.completed_at
                  ).toLocaleString()}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default RescueDetails;