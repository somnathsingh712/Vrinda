import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Siren,
  AlertTriangle,
  CalendarDays,
  Loader2,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../services/api";

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
  created_at?: string;
}

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

function VolunteerDetails() {
  const { volunteerId } = useParams();

  const [volunteer, setVolunteer] =
    useState<Volunteer | null>(null);

  const [rescueRequests, setRescueRequests] =
    useState<RescueRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (volunteerId) {
      fetchVolunteerData();
    }
  }, [volunteerId]);

  async function fetchVolunteerData() {
    try {
      setLoading(true);
      setError("");

      const [
        volunteerResponse,
        rescueResponse,
      ] = await Promise.all([
        api.get(
          `/volunteers/${volunteerId}`
        ),
        api.get("/rescue/"),
      ]);

      setVolunteer(
        volunteerResponse.data
      );

      setRescueRequests(
        rescueResponse.data
      );
    } catch (error) {
      console.error(
        "Error fetching volunteer details:",
        error
      );

      setError(
        "Unable to load volunteer details."
      );
    } finally {
      setLoading(false);
    }
  }

  const assignedRescues = useMemo(() => {
    if (!volunteer) {
      return [];
    }

    return rescueRequests.filter(
      (request) =>
        request.assigned_volunteer ===
        volunteer.volunteer_id
    );
  }, [rescueRequests, volunteer]);

  const rescueStats = useMemo(() => {
    return {
      total: assignedRescues.length,

      active: assignedRescues.filter(
        (request) =>
          request.status === "Assigned" ||
          request.status === "In Progress"
      ).length,

      completed: assignedRescues.filter(
        (request) =>
          request.status === "Completed"
      ).length,

      pending: assignedRescues.filter(
        (request) =>
          request.status === "Pending" ||
          request.status === "Accepted"
      ).length,
    };
  }, [assignedRescues]);

  function getStatusClass(
    status?: string
  ) {
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

  function getAvailabilityClass(
    availability?: string
  ) {
    if (availability === "Available") {
      return "bg-blue-100 text-blue-700";
    }

    if (availability === "Busy") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-gray-100 text-gray-600";
  }

  function getStatusIcon(
    status?: string
  ) {
    switch (status) {
      case "Pending":
        return <Clock size={15} />;

      case "Accepted":
        return <CheckCircle2 size={15} />;

      case "Assigned":
        return <BriefcaseBusiness size={15} />;

      case "In Progress":
        return <Siren size={15} />;

      case "Completed":
        return <CheckCircle2 size={15} />;

      default:
        return <Siren size={15} />;
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

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function getAnimalName(
    request: RescueRequest
  ) {
    return (
      request.animal_type ||
      request.species ||
      "Animal"
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-center">

          <Loader2
            size={32}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading volunteer details...
          </p>

        </div>

      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div className="space-y-5">

        <Link
          to="/volunteers"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Volunteers
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">

          <AlertTriangle
            size={35}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-3 text-lg font-semibold text-gray-900">
            Volunteer not found
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            {error ||
              "The requested volunteer could not be found."}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>

        <Link
          to="/volunteers"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Volunteers
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
              {volunteer.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                {volunteer.name}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {volunteer.volunteer_id}
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${
                volunteer.status ===
                "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {volunteer.status ===
              "Active" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}

              {volunteer.status ||
                "Unknown"}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${getAvailabilityClass(
                volunteer.availability
              )}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  volunteer.availability ===
                  "Available"
                    ? "bg-blue-500"
                    : volunteer.availability ===
                      "Busy"
                    ? "bg-orange-500"
                    : "bg-gray-400"
                }`}
              />

              {volunteer.availability ||
                "Unknown"}
            </span>

          </div>

        </div>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Assigned Rescues
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {rescueStats.total}
          </p>

          <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Siren size={18} />
          </div>

        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Active Rescues
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {rescueStats.active}
          </p>

          <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
            <Clock size={18} />
          </div>

        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {rescueStats.completed}
          </p>

          <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
            <CheckCircle2 size={18} />
          </div>

        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Current Availability
          </p>

          <p className="mt-1 text-lg font-bold text-gray-900">
            {volunteer.availability ||
              "Unknown"}
          </p>

          <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
            <User size={18} />
          </div>

        </div>

      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Profile */}
        <div className="xl:col-span-1">

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 p-5">

              <h2 className="text-lg font-semibold text-gray-900">
                Volunteer Profile
              </h2>

            </div>

            <div className="space-y-5 p-5">

              {/* Phone */}
              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Phone size={17} />
                </div>

                <div className="min-w-0">

                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-gray-800">
                    {volunteer.phone ||
                      "Not provided"}
                  </p>

                </div>

              </div>

              {/* Email */}
              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Mail size={17} />
                </div>

                <div className="min-w-0">

                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-gray-800">
                    {volunteer.email ||
                      "Not provided"}
                  </p>

                </div>

              </div>

              {/* Location */}
              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <MapPin size={17} />
                </div>

                <div>

                  <p className="text-xs text-gray-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {volunteer.location ||
                      "Not provided"}
                  </p>

                </div>

              </div>

              {/* Skills */}
              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <BriefcaseBusiness size={17} />
                </div>

                <div className="min-w-0">

                  <p className="text-xs text-gray-400">
                    Skills
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-gray-800">
                    {volunteer.skills ||
                      "Not provided"}
                  </p>

                </div>

              </div>

              {/* Joined */}
              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <CalendarDays size={17} />
                </div>

                <div>

                  <p className="text-xs text-gray-400">
                    Added On
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {formatDate(
                      volunteer.created_at
                    )}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Rescue activity */}
        <div className="xl:col-span-2">

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex flex-col gap-2 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Rescue Activity
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Rescue requests assigned to this volunteer
                </p>

              </div>

              <Link
                to="/rescue"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all rescues →
              </Link>

            </div>

            {assignedRescues.length ===
            0 ? (
              <div className="p-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <Siren size={23} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  No rescue assignments
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  This volunteer has not been assigned to any rescue request yet.
                </p>

              </div>
            ) : (
              <div className="divide-y divide-gray-100">

                {assignedRescues.map(
                  (rescue) => (
                    <div
                      key={rescue._id}
                      className="p-5 transition hover:bg-gray-50"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <Link
                              to={`/rescue/${rescue.request_id}`}
                              className="font-semibold text-gray-900 hover:text-blue-600"
                            >
                              {
                                rescue.request_id
                              }
                            </Link>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                rescue.status
                              )}`}
                            >
                              {getStatusIcon(
                                rescue.status
                              )}

                              {rescue.status ||
                                "Unknown"}
                            </span>

                          </div>

                          <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-500 sm:grid-cols-2">

                            <span>
                              <span className="font-medium text-gray-700">
                                Animal:
                              </span>{" "}
                              {getAnimalName(
                                rescue
                              )}
                            </span>

                            <span>
                              <span className="font-medium text-gray-700">
                                Location:
                              </span>{" "}
                              {rescue.location ||
                                "—"}
                            </span>

                          </div>

                          <p className="mt-2 text-xs text-gray-400">
                            Created{" "}
                            {formatDate(
                              rescue.created_at
                            )}
                          </p>

                        </div>

                        <Link
                          to={`/rescue/${rescue.request_id}`}
                          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                        >
                          View Rescue
                        </Link>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Current assignment notice */}
      {volunteer.availability ===
        "Busy" && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">

          <div className="flex gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <BriefcaseBusiness size={20} />
            </div>

            <div>

              <h3 className="font-semibold text-orange-800">
                Volunteer currently busy
              </h3>

              <p className="mt-1 text-sm text-orange-700">
                This volunteer is currently marked as
                {" "}
                <strong>Busy</strong>. They will become
                available again when their assigned rescue
                is completed.
              </p>

              {assignedRescues.some(
                (rescue) =>
                  rescue.status ===
                    "Assigned" ||
                  rescue.status ===
                    "In Progress"
              ) && (
                <p className="mt-2 text-xs font-medium text-orange-700">
                  There is an active rescue assignment associated with this volunteer.
                </p>
              )}

            </div>

          </div>

        </div>
      )}

      {/* Footer */}
      <div>

        <Link
          to="/volunteers"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft size={17} />
          Back to Volunteers
        </Link>

      </div>

    </div>
  );
}

export default VolunteerDetails;