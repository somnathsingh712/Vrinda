import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Filter,
  ArrowUpDown,
  Users,
  UserCheck,
  UserX,
  BriefcaseBusiness,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

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

function Volunteers() {
  const [volunteers, setVolunteers] = useState<
    Volunteer[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [availabilityFilter, setAvailabilityFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("newest");

  useEffect(() => {
    fetchVolunteers();
  }, []);

  async function fetchVolunteers() {
    try {
      setLoading(true);

      const response = await api.get(
        "/volunteers/"
      );

      setVolunteers(response.data);
    } catch (error) {
      console.error(
        "Error fetching volunteers:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredVolunteers = useMemo(() => {
    let result = [...volunteers];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((volunteer) =>
        [
          volunteer.volunteer_id,
          volunteer.name,
          volunteer.phone,
          volunteer.email,
          volunteer.location,
          volunteer.skills,
          volunteer.availability,
          volunteer.status,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query)
          )
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter(
        (volunteer) =>
          volunteer.status === statusFilter
      );
    }

    // Availability filter
    if (availabilityFilter !== "All") {
      result = result.filter(
        (volunteer) =>
          volunteer.availability ===
          availabilityFilter
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(
            b.created_at || 0
          ).getTime() -
          new Date(
            a.created_at || 0
          ).getTime()
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(
            a.created_at || 0
          ).getTime() -
          new Date(
            b.created_at || 0
          ).getTime()
        );
      }

      if (sortBy === "name") {
        return a.name.localeCompare(
          b.name
        );
      }

      if (sortBy === "location") {
        return (
          a.location || ""
        ).localeCompare(
          b.location || ""
        );
      }

      return 0;
    });

    return result;
  }, [
    volunteers,
    search,
    statusFilter,
    availabilityFilter,
    sortBy,
  ]);

  const stats = useMemo(() => {
    return {
      total: volunteers.length,

      active: volunteers.filter(
        (volunteer) =>
          volunteer.status === "Active"
      ).length,

      available: volunteers.filter(
        (volunteer) =>
          volunteer.status === "Active" &&
          volunteer.availability ===
            "Available"
      ).length,

      busy: volunteers.filter(
        (volunteer) =>
          volunteer.status === "Active" &&
          volunteer.availability ===
            "Busy"
      ).length,
    };
  }, [volunteers]);

  function getStatusClass(
    status?: string
  ) {
    if (status === "Active") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Inactive") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
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

  function getAvailabilityDot(
    availability?: string
  ) {
    if (availability === "Available") {
      return "bg-blue-500";
    }

    if (availability === "Busy") {
      return "bg-orange-500";
    }

    return "bg-gray-400";
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setAvailabilityFilter("All");
    setSortBy("newest");
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

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Users size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Volunteers
            </h1>

            <p className="text-sm text-gray-500">
              Manage volunteers and rescue team members
            </p>
          </div>

        </div>

        <Link
          to="/volunteers/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Volunteer
        </Link>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Volunteers
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.total}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Users size={21} />
            </div>

          </div>

        </div>

        {/* Active */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Active
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.active}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <UserCheck size={21} />
            </div>

          </div>

        </div>

        {/* Available */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Available
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.available}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <UserCheck size={21} />
            </div>

          </div>

        </div>

        {/* Busy */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Busy
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.busy}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <BriefcaseBusiness size={21} />
            </div>

          </div>

        </div>

      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

          {/* Search */}
          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, ID, location, skills..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Status */}
          <div className="flex items-center gap-2">

            <Filter
              size={17}
              className="text-gray-500"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

          </div>

          {/* Availability */}
          <select
            value={availabilityFilter}
            onChange={(e) =>
              setAvailabilityFilter(
                e.target.value
              )
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">
              All Availability
            </option>

            <option value="Available">
              Available
            </option>

            <option value="Busy">
              Busy
            </option>
          </select>

          {/* Sort */}
          <div className="flex items-center gap-2">

            <ArrowUpDown
              size={17}
              className="text-gray-500"
            />

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="name">
                Name
              </option>

              <option value="location">
                Location
              </option>
            </select>

          </div>

          {/* Clear */}
          {(search ||
            statusFilter !== "All" ||
            availabilityFilter !==
              "All" ||
            sortBy !== "newest") && (
            <button
              onClick={clearFilters}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Clear
            </button>
          )}

        </div>

        <div className="mt-3 text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredVolunteers.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">
            {volunteers.length}
          </span>{" "}
          volunteers
        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading volunteers...
          </p>

        </div>
      )}

      {/* Empty */}
      {!loading &&
        filteredVolunteers.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <Users size={27} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No volunteers found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your filters or add a new volunteer.
            </p>

            <Link
              to="/volunteers/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Add Volunteer
            </Link>

          </div>
        )}

      {/* Desktop Table */}
      {!loading &&
        filteredVolunteers.length > 0 && (
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:block">

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="border-b border-gray-200 bg-gray-50">

                  <tr>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Volunteer
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Location
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Skills
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Availability
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredVolunteers.map(
                    (volunteer) => (
                      <tr
                        key={
                          volunteer._id
                        }
                        className="transition hover:bg-gray-50"
                      >

                        {/* Volunteer */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                              {volunteer.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <div className="font-semibold text-gray-900">
                                {volunteer.name}
                              </div>

                              <div className="text-xs text-gray-500">
                                {
                                  volunteer.volunteer_id
                                }
                              </div>

                            </div>

                          </div>

                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4">

                          <div className="text-sm text-gray-700">
                            {volunteer.phone ||
                              "—"}
                          </div>

                          <div className="mt-1 max-w-[180px] truncate text-xs text-gray-500">
                            {volunteer.email ||
                              "—"}
                          </div>

                        </td>

                        {/* Location */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5 text-sm text-gray-600">

                            <MapPin
                              size={15}
                              className="shrink-0 text-gray-400"
                            />

                            {volunteer.location ||
                              "—"}

                          </div>

                        </td>

                        {/* Skills */}
                        <td className="px-5 py-4">

                          {volunteer.skills ? (
                            <span className="inline-block max-w-[180px] truncate rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                              {
                                volunteer.skills
                              }
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">
                              —
                            </span>
                          )}

                        </td>

                        {/* Availability */}
                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getAvailabilityClass(
                              volunteer.availability
                            )}`}
                          >

                            <span
                              className={`h-1.5 w-1.5 rounded-full ${getAvailabilityDot(
                                volunteer.availability
                              )}`}
                            />

                            {volunteer.availability ||
                              "Unknown"}

                          </span>

                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              volunteer.status
                            )}`}
                          >
                            {volunteer.status ||
                              "Unknown"}
                          </span>

                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">

                          <Link
                            to={`/volunteers/${volunteer.volunteer_id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={16} />
                            View
                          </Link>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      {/* Mobile Cards */}
      {!loading &&
        filteredVolunteers.length > 0 && (
          <div className="space-y-4 lg:hidden">

            {filteredVolunteers.map(
              (volunteer) => (
                <div
                  key={volunteer._id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >

                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                        {volunteer.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <h3 className="font-bold text-gray-900">
                          {volunteer.name}
                        </h3>

                        <p className="text-xs text-gray-500">
                          {
                            volunteer.volunteer_id
                          }
                        </p>

                      </div>

                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        volunteer.status
                      )}`}
                    >
                      {volunteer.status ||
                        "Unknown"}
                    </span>

                  </div>

                  {/* Details */}
                  <div className="mt-5 grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {volunteer.phone ||
                          "—"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Location
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-sm font-medium text-gray-800">
                        <MapPin
                          size={14}
                          className="text-gray-400"
                        />

                        {volunteer.location ||
                          "—"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Availability
                      </p>

                      <span
                        className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getAvailabilityClass(
                          volunteer.availability
                        )}`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getAvailabilityDot(
                            volunteer.availability
                          )}`}
                        />

                        {volunteer.availability ||
                          "Unknown"}

                      </span>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Added
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {formatDate(
                          volunteer.created_at
                        )}
                      </p>

                    </div>

                  </div>

                  {/* Skills */}
                  {volunteer.skills && (
                    <div className="mt-4">

                      <p className="text-xs text-gray-400">
                        Skills
                      </p>

                      <p className="mt-1 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                        {volunteer.skills}
                      </p>

                    </div>
                  )}

                  {/* Email */}
                  {volunteer.email && (
                    <div className="mt-4">

                      <p className="text-xs text-gray-400">
                        Email
                      </p>

                      <p className="mt-1 truncate text-sm text-gray-700">
                        {volunteer.email}
                      </p>

                    </div>
                  )}

                  {/* Action */}
                  <Link
                    to={`/volunteers/${volunteer.volunteer_id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Eye size={17} />
                    View Volunteer
                  </Link>

                </div>
              )
            )}

          </div>
        )}

    </div>
  );
}

export default Volunteers;