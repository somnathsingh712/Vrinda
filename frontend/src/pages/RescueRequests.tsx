import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Filter,
  ArrowUpDown,
  Siren,
  Clock,
  CheckCircle2,
  UserCheck,
  PlayCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

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

function RescueRequests() {
  const [requests, setRequests] = useState<RescueRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      setLoading(true);

      const response = await api.get("/rescue/");

      setRequests(response.data);
    } catch (error) {
      console.error(
        "Error fetching rescue requests:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((request) =>
        [
          request.request_id,
          request.animal_id,
          request.animal_type,
          request.species,
          request.location,
          request.description,
          request.assigned_volunteer,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query)
          )
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (request) =>
          request.status === statusFilter
      );
    }

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

      if (sortBy === "location") {
        return (
          (a.location || "").localeCompare(
            b.location || ""
          )
        );
      }

      return 0;
    });

    return result;
  }, [
    requests,
    search,
    statusFilter,
    sortBy,
  ]);

  const stats = useMemo(() => {
    return {
      total: requests.length,

      pending: requests.filter(
        (request) =>
          request.status === "Pending"
      ).length,

      active: requests.filter(
        (request) =>
          request.status === "Accepted" ||
          request.status === "Assigned" ||
          request.status === "In Progress"
      ).length,

      completed: requests.filter(
        (request) =>
          request.status === "Completed"
      ).length,
    };
  }, [requests]);

  const statusOptions = [
    "All",
    "Pending",
    "Accepted",
    "Assigned",
    "In Progress",
    "Completed",
  ];

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
        return <Clock size={14} />;

      case "Accepted":
        return <CheckCircle2 size={14} />;

      case "Assigned":
        return <UserCheck size={14} />;

      case "In Progress":
        return <PlayCircle size={14} />;

      case "Completed":
        return <CheckCircle2 size={14} />;

      default:
        return <Siren size={14} />;
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

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setSortBy("newest");
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Siren size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Rescue Requests
              </h1>

              <p className="text-sm text-gray-500">
                Manage and track animal rescue operations
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/rescue/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
        >
          <Plus size={18} />
          New Rescue Request
        </Link>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Requests
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.total}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Siren size={21} />
            </div>

          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <Clock size={21} />
            </div>

          </div>
        </div>

        {/* Active */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Active Rescues
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.active}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <PlayCircle size={21} />
            </div>

          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Completed
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.completed}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <CheckCircle2 size={21} />
            </div>

          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

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
              placeholder="Search by request ID, animal, location..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                setStatusFilter(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            >
              {statusOptions.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status === "All"
                      ? "All Statuses"
                      : status}
                  </option>
                )
              )}
            </select>

          </div>

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
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="location">
                Location
              </option>
            </select>

          </div>

          {/* Clear */}
          {(search ||
            statusFilter !== "All" ||
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
            {filteredRequests.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">
            {requests.length}
          </span>{" "}
          rescue requests
        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading rescue requests...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        filteredRequests.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <Siren size={26} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No rescue requests found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your filters or create a new rescue request.
            </p>

            <Link
              to="/rescue/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
            >
              <Plus size={17} />
              New Rescue Request
            </Link>

          </div>
        )}

      {/* Desktop Table */}
      {!loading &&
        filteredRequests.length > 0 && (
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:block">

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="border-b border-gray-200 bg-gray-50">

                  <tr>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Request
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Animal
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Location
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Volunteer
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Created
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredRequests.map(
                    (request) => (
                      <tr
                        key={request._id}
                        className="transition hover:bg-gray-50"
                      >

                        {/* Request */}
                        <td className="px-5 py-4">

                          <div className="font-semibold text-gray-900">
                            {request.request_id}
                          </div>

                          {request.description && (
                            <div className="mt-1 max-w-xs truncate text-xs text-gray-500">
                              {request.description}
                            </div>
                          )}

                        </td>

                        {/* Animal */}
                        <td className="px-5 py-4">

                          <div className="font-medium text-gray-800">
                            {getAnimalName(request)}
                          </div>

                          {request.animal_id && (
                            <div className="text-xs text-gray-500">
                              {request.animal_id}
                            </div>
                          )}

                        </td>

                        {/* Location */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {request.location || "—"}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(
                              request.status
                            )}

                            {request.status ||
                              "Unknown"}
                          </span>

                        </td>

                        {/* Volunteer */}
                        <td className="px-5 py-4 text-sm text-gray-600">

                          {request.assigned_volunteer ? (
                            <span className="inline-flex items-center gap-1.5">
                              <UserCheck
                                size={15}
                                className="text-purple-600"
                              />

                              {request.assigned_volunteer}
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              Not assigned
                            </span>
                          )}

                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(
                            request.created_at
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">

                          <Link
                            to={`/rescue/${request.request_id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
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
        filteredRequests.length > 0 && (
          <div className="space-y-4 lg:hidden">

            {filteredRequests.map(
              (request) => (
                <div
                  key={request._id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >

                  {/* Top */}
                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Rescue Request
                      </p>

                      <h3 className="mt-1 font-bold text-gray-900">
                        {request.request_id}
                      </h3>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(
                        request.status
                      )}

                      {request.status ||
                        "Unknown"}
                    </span>

                  </div>

                  {/* Details */}
                  <div className="mt-5 grid grid-cols-2 gap-4">

                    <div>
                      <p className="text-xs text-gray-400">
                        Animal
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {getAnimalName(request)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {request.location ||
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Volunteer
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {request.assigned_volunteer ||
                          "Not assigned"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Created
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {formatDate(
                          request.created_at
                        )}
                      </p>
                    </div>

                  </div>

                  {/* Description */}
                  {request.description && (
                    <div className="mt-4 rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">
                        Description
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {request.description}
                      </p>
                    </div>
                  )}

                  {/* Action */}
                  <Link
                    to={`/rescue/${request.request_id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    <Eye size={17} />
                    View Rescue Details
                  </Link>

                </div>
              )
            )}

          </div>
        )}

    </div>
  );
}

export default RescueRequests;