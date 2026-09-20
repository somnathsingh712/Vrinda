import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

function VolunteerDetails() {
  const { volunteerId } = useParams();

  const [volunteer, setVolunteer] =
    useState<Volunteer | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteer();
  }, [volunteerId]);

  async function fetchVolunteer() {
    try {
      const response = await api.get(
        `/volunteers/${volunteerId}`
      );

      setVolunteer(response.data);
    } catch (error) {
      console.error(
        "Error fetching volunteer:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8">
        <p className="text-gray-600">
          Loading volunteer...
        </p>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="rounded-xl border bg-white p-8">
        <h2 className="text-xl font-semibold">
          Volunteer not found
        </h2>

        <Link
          to="/volunteers"
          className="mt-4 inline-block rounded-lg bg-gray-900 px-5 py-3 text-white"
        >
          Back to Volunteers
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {volunteer.name}
          </h1>

          <p className="mt-2 text-gray-600">
            Volunteer ID:{" "}
            <span className="font-mono">
              {volunteer.volunteer_id}
            </span>
          </p>
        </div>

        <Link
          to="/volunteers"
          className="rounded-lg border border-gray-300 px-5 py-3 text-gray-700 transition hover:bg-gray-100"
        >
          ← Back
        </Link>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Status */}
        <div className="mb-8 flex gap-3">
          <span
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              volunteer.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {volunteer.status}
          </span>

          <span
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              volunteer.availability === "Available"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {volunteer.availability}
          </span>
        </div>

        {/* Information */}
        <div className="grid grid-cols-2 gap-8">
          {/* Volunteer ID */}
          <div>
            <p className="text-sm text-gray-500">
              Volunteer ID
            </p>

            <h3 className="mt-1 font-mono text-lg">
              {volunteer.volunteer_id}
            </h3>
          </div>

          {/* Name */}
          <div>
            <p className="text-sm text-gray-500">
              Full Name
            </p>

            <h3 className="mt-1 text-lg font-medium">
              {volunteer.name}
            </h3>
          </div>

          {/* Phone */}
          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>

            <h3 className="mt-1 text-lg">
              {volunteer.phone}
            </h3>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <h3 className="mt-1 text-lg">
              {volunteer.email}
            </h3>
          </div>

          {/* Location */}
          <div>
            <p className="text-sm text-gray-500">
              Location
            </p>

            <h3 className="mt-1 text-lg">
              {volunteer.location}
            </h3>
          </div>

          {/* Availability */}
          <div>
            <p className="text-sm text-gray-500">
              Availability
            </p>

            <h3 className="mt-1 text-lg">
              {volunteer.availability}
            </h3>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-8 border-t pt-8">
          <p className="text-sm text-gray-500">
            Skills
          </p>

          <p className="mt-2 text-lg">
            {volunteer.skills}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VolunteerDetails;