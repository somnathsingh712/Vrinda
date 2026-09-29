import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  UserCheck,
  PlayCircle,
  Siren,
  AlertTriangle,
  CalendarDays,
  PawPrint,
  Loader2,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";

interface RescueRequest {
  _id: string;
  request_id: string;

  animal_id?: string;
  animal_type?: string;
  species?: string;

  location?: string;
  description?: string;

  status?: string;

  assigned_volunteer?: string;

  created_at?: string;
  accepted_at?: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
}

interface Volunteer {
  _id: string;
  volunteer_id: string;
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  availability?: string;
  skills?: string;
  status?: string;
}

function RescueDetails() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] =
    useState<RescueRequest | null>(null);

  const [volunteers, setVolunteers] =
    useState<Volunteer[]>([]);

  const [selectedVolunteer, setSelectedVolunteer] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [volunteersLoading, setVolunteersLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (requestId) {
      fetchRequest();
    }
  }, [requestId]);

  async function fetchRequest() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/rescue/${requestId}`
      );

      setRequest(response.data);
    } catch (error) {
      console.error(
        "Error fetching rescue request:",
        error
      );

      setError(
        "Unable to load rescue request."
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchAvailableVolunteers() {
    if (!requestId) {
      return;
    }

    try {
      setVolunteersLoading(true);

      const response = await api.get(
        `/rescue/${requestId}/volunteers`
      );

      setVolunteers(response.data);
    } catch (error) {
      console.error(
        "Error fetching volunteers:",
        error
      );
    } finally {
      setVolunteersLoading(false);
    }
  }

  async function acceptRequest() {
    if (!requestId) {
      return;
    }

    const confirmed = window.confirm(
      "Accept this rescue request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await api.put(
        `/rescue/${requestId}/accept`
      );

      await fetchRequest();

      alert(
        "Rescue request accepted successfully."
      );
    } catch (error) {
      console.error(
        "Error accepting rescue request:",
        error
      );

      alert(
        "Failed to accept rescue request."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function assignVolunteer() {
    if (!requestId) {
      return;
    }

    if (!selectedVolunteer) {
      alert(
        "Please select a volunteer first."
      );
      return;
    }

    const confirmed = window.confirm(
      "Assign this volunteer to the rescue request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await api.put(
        `/rescue/${requestId}/assign`,
        {
          volunteer_id: selectedVolunteer,
        }
      );

      await fetchRequest();

      setSelectedVolunteer("");
      setVolunteers([]);

      alert(
        "Volunteer assigned successfully."
      );
    } catch (error) {
      console.error(
        "Error assigning volunteer:",
        error
      );

      alert(
        "Failed to assign volunteer."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function startRescue() {
    if (!requestId) {
      return;
    }

    const confirmed = window.confirm(
      "Start this rescue operation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await api.put(
        `/rescue/${requestId}/start`
      );

      await fetchRequest();

      alert(
        "Rescue operation started."
      );
    } catch (error) {
      console.error(
        "Error starting rescue:",
        error
      );

      alert(
        "Failed to start rescue."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function completeRescue() {
    if (!requestId) {
      return;
    }

    const confirmed = window.confirm(
      "Mark this rescue as completed?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await api.put(
        `/rescue/${requestId}/complete`
      );

      await fetchRequest();

      alert(
        "Rescue completed successfully."
      );
    } catch (error) {
      console.error(
        "Error completing rescue:",
        error
      );

      alert(
        "Failed to complete rescue."
      );
    } finally {
      setActionLoading(false);
    }
  }

  function getStatusClass(status?: string) {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Accepted":
        return "bg-blue-100 text-blue-700";

      case "Assigned":
        return "bg-purple-100 text-purple-700";

      case "In Progress":
        return "bg-orange-100 text-orange-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getStatusIcon(status?: string) {
    switch (status) {
      case "Pending":
        return <Clock size={16} />;

      case "Accepted":
        return <CheckCircle2 size={16} />;

      case "Assigned":
        return <UserCheck size={16} />;

      case "In Progress":
        return <PlayCircle size={16} />;

      case "Completed":
        return <CheckCircle2 size={16} />;

      default:
        return <Siren size={16} />;
    }
  }

  function formatDate(date?: string) {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function getAnimalName() {
    return (
      request?.animal_type ||
      request?.species ||
      "Animal"
    );
  }

  function isStepCompleted(
    step: string
  ) {
    const status = request?.status;

    if (step === "Pending") {
      return true;
    }

    if (step === "Accepted") {
      return (
        status === "Accepted" ||
        status === "Assigned" ||
        status === "In Progress" ||
        status === "Completed"
      );
    }

    if (step === "Assigned") {
      return (
        status === "Assigned" ||
        status === "In Progress" ||
        status === "Completed"
      );
    }

    if (step === "In Progress") {
      return (
        status === "In Progress" ||
        status === "Completed"
      );
    }

    if (step === "Completed") {
      return status === "Completed";
    }

    return false;
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-center">

          <Loader2
            size={32}
            className="mx-auto animate-spin text-red-600"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading rescue details...
          </p>

        </div>

      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="space-y-5">

        <Link
          to="/rescue"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600"
        >
          <ArrowLeft size={17} />
          Back to Rescue Requests
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">

          <AlertTriangle
            size={35}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-3 text-lg font-semibold text-gray-900">
            Rescue request not found
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            {error ||
              "The requested rescue could not be found."}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <Link
            to="/rescue"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-red-600"
          >
            <ArrowLeft size={17} />
            Back to Rescue Requests
          </Link>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Siren size={25} />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                {request.request_id}
              </h1>

              <p className="text-sm text-gray-500">
                Rescue request details and workflow
              </p>

            </div>

          </div>

        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
            request.status
          )}`}
        >
          {getStatusIcon(request.status)}

          {request.status || "Unknown"}
        </span>

      </div>

      {/* Workflow */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="mb-6">

          <h2 className="text-lg font-semibold text-gray-900">
            Rescue Workflow
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track the progress of this rescue operation
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">

          {[
            "Pending",
            "Accepted",
            "Assigned",
            "In Progress",
            "Completed",
          ].map((step, index) => {

            const completed =
              isStepCompleted(step);

            return (
              <div
                key={step}
                className="relative"
              >

                <div
                  className={`rounded-xl border p-4 ${
                    completed
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >

                  <div className="flex items-center gap-2">

                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        completed
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2
                          size={17}
                        />
                      ) : (
                        <span className="text-xs font-bold">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-sm font-semibold ${
                        completed
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {step}
                    </span>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Rescue Information */}
        <div className="xl:col-span-2">

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 p-5">

              <h2 className="text-lg font-semibold text-gray-900">
                Rescue Information
              </h2>

            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">

              {/* Animal */}
              <div className="rounded-lg bg-gray-50 p-4">

                <div className="flex items-center gap-2 text-gray-500">
                  <PawPrint size={17} />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Animal
                  </span>
                </div>

                <p className="mt-2 font-semibold text-gray-900">
                  {getAnimalName()}
                </p>

                {request.animal_id && (
                  <p className="mt-1 text-xs text-gray-500">
                    ID: {request.animal_id}
                  </p>
                )}

              </div>

              {/* Location */}
              <div className="rounded-lg bg-gray-50 p-4">

                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={17} />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Location
                  </span>
                </div>

                <p className="mt-2 font-semibold text-gray-900">
                  {request.location ||
                    "Not provided"}
                </p>

              </div>

              {/* Created */}
              <div className="rounded-lg bg-gray-50 p-4">

                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarDays size={17} />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Created
                  </span>
                </div>

                <p className="mt-2 font-semibold text-gray-900">
                  {formatDate(
                    request.created_at
                  )}
                </p>

              </div>

              {/* Volunteer */}
              <div className="rounded-lg bg-gray-50 p-4">

                <div className="flex items-center gap-2 text-gray-500">
                  <UserCheck size={17} />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Assigned Volunteer
                  </span>
                </div>

                <p className="mt-2 font-semibold text-gray-900">
                  {request.assigned_volunteer ||
                    "Not assigned"}
                </p>

              </div>

              {/* Description */}
              <div className="sm:col-span-2">

                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Description
                </p>

                <div className="mt-2 rounded-lg border border-gray-200 bg-white p-4">

                  <p className="text-sm leading-6 text-gray-700">
                    {request.description ||
                      "No description provided."}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Action Panel */}
        <div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 p-5">

              <h2 className="text-lg font-semibold text-gray-900">
                Rescue Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the rescue workflow
              </p>

            </div>

            <div className="space-y-4 p-5">

              {/* Pending */}
              {request.status ===
                "Pending" && (
                <div>

                  <div className="mb-3 rounded-lg bg-yellow-50 p-3">

                    <div className="flex gap-2">

                      <Clock
                        size={18}
                        className="mt-0.5 shrink-0 text-yellow-600"
                      />

                      <div>

                        <p className="text-sm font-semibold text-yellow-800">
                          Waiting for acceptance
                        </p>

                        <p className="mt-1 text-xs text-yellow-700">
                          Accept this request before assigning a volunteer.
                        </p>

                      </div>

                    </div>

                  </div>

                  <button
                    onClick={acceptRequest}
                    disabled={actionLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading ? (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}

                    Accept Rescue
                  </button>

                </div>
              )}

              {/* Accepted */}
              {request.status ===
                "Accepted" && (
                <div>

                  <div className="mb-3 rounded-lg bg-blue-50 p-3">

                    <div className="flex gap-2">

                      <UserCheck
                        size={18}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />

                      <div>

                        <p className="text-sm font-semibold text-blue-800">
                          Volunteer required
                        </p>

                        <p className="mt-1 text-xs text-blue-700">
                          Select an available volunteer for this rescue.
                        </p>

                      </div>

                    </div>

                  </div>

                  <button
                    onClick={
                      fetchAvailableVolunteers
                    }
                    disabled={
                      volunteersLoading
                    }
                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                  >
                    {volunteersLoading ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <UserCheck size={17} />
                    )}

                    Find Available Volunteers
                  </button>

                  {volunteers.length > 0 && (
                    <div className="space-y-3">

                      <select
                        value={
                          selectedVolunteer
                        }
                        onChange={(e) =>
                          setSelectedVolunteer(
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      >
                        <option value="">
                          Select Volunteer
                        </option>

                        {volunteers.map(
                          (volunteer) => (
                            <option
                              key={
                                volunteer.volunteer_id
                              }
                              value={
                                volunteer.volunteer_id
                              }
                            >
                              {volunteer.name} —{" "}
                              {volunteer.volunteer_id}
                            </option>
                          )
                        )}

                      </select>

                      <button
                        onClick={
                          assignVolunteer
                        }
                        disabled={
                          actionLoading ||
                          !selectedVolunteer
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading ? (
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                        ) : (
                          <UserCheck
                            size={18}
                          />
                        )}

                        Assign Volunteer
                      </button>

                    </div>
                  )}

                  {volunteers.length === 0 &&
                    !volunteersLoading && (
                      <p className="rounded-lg bg-gray-50 p-3 text-center text-xs text-gray-500">
                        Click "Find Available Volunteers" to load volunteers.
                      </p>
                    )}

                </div>
              )}

              {/* Assigned */}
              {request.status ===
                "Assigned" && (
                <div>

                  <div className="mb-3 rounded-lg bg-purple-50 p-3">

                    <div className="flex gap-2">

                      <UserCheck
                        size={18}
                        className="mt-0.5 shrink-0 text-purple-600"
                      />

                      <div>

                        <p className="text-sm font-semibold text-purple-800">
                          Volunteer assigned
                        </p>

                        <p className="mt-1 text-xs text-purple-700">
                          {request.assigned_volunteer}
                        </p>

                      </div>

                    </div>

                  </div>

                  <button
                    onClick={startRescue}
                    disabled={actionLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading ? (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <PlayCircle size={18} />
                    )}

                    Start Rescue
                  </button>

                </div>
              )}

              {/* In Progress */}
              {request.status ===
                "In Progress" && (
                <div>

                  <div className="mb-3 rounded-lg bg-orange-50 p-3">

                    <div className="flex gap-2">

                      <PlayCircle
                        size={18}
                        className="mt-0.5 shrink-0 text-orange-600"
                      />

                      <div>

                        <p className="text-sm font-semibold text-orange-800">
                          Rescue in progress
                        </p>

                        <p className="mt-1 text-xs text-orange-700">
                          Volunteer:{" "}
                          {request.assigned_volunteer ||
                            "Assigned volunteer"}
                        </p>

                      </div>

                    </div>

                  </div>

                  <button
                    onClick={
                      completeRescue
                    }
                    disabled={actionLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading ? (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <CheckCircle2
                        size={18}
                      />
                    )}

                    Complete Rescue
                  </button>

                </div>
              )}

              {/* Completed */}
              {request.status ===
                "Completed" && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">

                  <div className="flex gap-3">

                    <CheckCircle2
                      size={22}
                      className="shrink-0 text-green-600"
                    />

                    <div>

                      <p className="font-semibold text-green-800">
                        Rescue Completed
                      </p>

                      <p className="mt-1 text-sm text-green-700">
                        This rescue operation has been successfully completed.
                      </p>

                      {request.completed_at && (
                        <p className="mt-2 text-xs text-green-600">
                          Completed:{" "}
                          {formatDate(
                            request.completed_at
                          )}
                        </p>
                      )}

                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 p-5">

          <h2 className="text-lg font-semibold text-gray-900">
            Activity Timeline
          </h2>

        </div>

        <div className="space-y-5 p-5">

          {/* Created */}
          <div className="flex gap-4">

            <div className="flex flex-col items-center">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <Siren size={17} />
              </div>

              <div className="mt-1 h-full w-px bg-gray-200" />

            </div>

            <div className="pb-4">

              <p className="font-semibold text-gray-900">
                Rescue request created
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {formatDate(
                  request.created_at
                )}
              </p>

            </div>

          </div>

          {/* Accepted */}
          {request.accepted_at && (
            <div className="flex gap-4">

              <div className="flex flex-col items-center">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <CheckCircle2 size={17} />
                </div>

                <div className="mt-1 h-full w-px bg-gray-200" />

              </div>

              <div className="pb-4">

                <p className="font-semibold text-gray-900">
                  Rescue accepted
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(
                    request.accepted_at
                  )}
                </p>

              </div>

            </div>
          )}

          {/* Assigned */}
          {request.assigned_at && (
            <div className="flex gap-4">

              <div className="flex flex-col items-center">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <UserCheck size={17} />
                </div>

                <div className="mt-1 h-full w-px bg-gray-200" />

              </div>

              <div className="pb-4">

                <p className="font-semibold text-gray-900">
                  Volunteer assigned
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {request.assigned_volunteer ||
                    "Volunteer"}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {formatDate(
                    request.assigned_at
                  )}
                </p>

              </div>

            </div>
          )}

          {/* Started */}
          {request.started_at && (
            <div className="flex gap-4">

              <div className="flex flex-col items-center">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <PlayCircle size={17} />
                </div>

                <div className="mt-1 h-full w-px bg-gray-200" />

              </div>

              <div className="pb-4">

                <p className="font-semibold text-gray-900">
                  Rescue started
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(
                    request.started_at
                  )}
                </p>

              </div>

            </div>
          )}

          {/* Completed */}
          {request.completed_at && (
            <div className="flex gap-4">

              <div className="flex flex-col items-center">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={17} />
                </div>

              </div>

              <div>

                <p className="font-semibold text-gray-900">
                  Rescue completed
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(
                    request.completed_at
                  )}
                </p>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* Back button */}
      <div>

        <button
          onClick={() =>
            navigate("/rescue")
          }
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft size={17} />
          Back to Rescue Requests
        </button>

      </div>

    </div>
  );
}

export default RescueDetails;