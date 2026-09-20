import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Filter,
  ArrowUpDown,
  Dog,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";

interface Animal {
  _id: string;
  animal_id: string;
  name?: string;
  species: string;
  breed?: string;
  gender?: string;
  age?: string | number;
  color?: string;
  location?: string;
  status?: string;
  created_at?: string;
}

function Animals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("newest");

  useEffect(() => {
    fetchAnimals();
  }, []);

  async function fetchAnimals() {
    try {
      const response = await api.get("/animals/");

      setAnimals(response.data);
    } catch (error) {
      console.error(
        "Error fetching animals:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Unique species
   */

  const speciesList = useMemo(() => {
    const species = animals
      .map((animal) => animal.species)
      .filter(Boolean);

    return Array.from(
      new Set(species)
    ).sort();
  }, [animals]);

  /*
   * Unique statuses
   */

  const statusList = useMemo(() => {
    const statuses = animals
      .map((animal) => animal.status)
      .filter(Boolean) as string[];

    return Array.from(
      new Set(statuses)
    ).sort();
  }, [animals]);

  /*
   * Filter + Search + Sort
   */

  const filteredAnimals = useMemo(() => {
    let result = [...animals];

    /*
     * Search
     */

    if (search.trim()) {
      const query =
        search.toLowerCase();

      result = result.filter((animal) => {
        return (
          animal.animal_id
            ?.toLowerCase()
            .includes(query) ||
          animal.name
            ?.toLowerCase()
            .includes(query) ||
          animal.species
            ?.toLowerCase()
            .includes(query) ||
          animal.breed
            ?.toLowerCase()
            .includes(query) ||
          animal.location
            ?.toLowerCase()
            .includes(query)
        );
      });
    }

    /*
     * Species filter
     */

    if (speciesFilter !== "All") {
      result = result.filter(
        (animal) =>
          animal.species ===
          speciesFilter
      );
    }

    /*
     * Status filter
     */

    if (statusFilter !== "All") {
      result = result.filter(
        (animal) =>
          animal.status ===
          statusFilter
      );
    }

    /*
     * Sorting
     */

    result.sort((a, b) => {
      if (sortBy === "name") {
        return (
          (a.name || "").localeCompare(
            b.name || ""
          )
        );
      }

      if (sortBy === "species") {
        return (
          a.species.localeCompare(
            b.species
          )
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

      /*
       * Default = newest
       */

      return (
        new Date(
          b.created_at || 0
        ).getTime() -
        new Date(
          a.created_at || 0
        ).getTime()
      );
    });

    return result;
  }, [
    animals,
    search,
    speciesFilter,
    statusFilter,
    sortBy,
  ]);

  /*
   * Clear filters
   */

  function clearFilters() {
    setSearch("");
    setSpeciesFilter("All");
    setStatusFilter("All");
    setSortBy("newest");
  }

  const hasFilters =
    search.trim() !== "" ||
    speciesFilter !== "All" ||
    statusFilter !== "All" ||
    sortBy !== "newest";

  return (
    <div>
      {/* Header */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-900 p-3">
              <Dog
                size={26}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Animals
              </h1>

              <p className="mt-1 text-gray-600">
                Manage and track registered animals.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/animals/register"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={20} />

          Register Animal
        </Link>
      </div>

      {/* Statistics */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Animals
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {loading
              ? "..."
              : animals.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Showing
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {loading
              ? "..."
              : filteredAnimals.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Species
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {loading
              ? "..."
              : speciesList.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Animals
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {loading
              ? "..."
              : animals.filter(
                  (animal) =>
                    animal.status ===
                    "Active"
                ).length}
          </p>
        </div>
      </div>

      {/* Search & Filters */}

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter
            size={20}
            className="text-gray-600"
          />

          <h2 className="font-semibold text-gray-900">
            Search & Filters
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Search */}

          <div className="relative">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search animal..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Species */}

          <select
            value={speciesFilter}
            onChange={(e) =>
              setSpeciesFilter(
                e.target.value
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
          >
            <option value="All">
              All Species
            </option>

            {speciesList.map(
              (species) => (
                <option
                  key={species}
                  value={species}
                >
                  {species}
                </option>
              )
            )}
          </select>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
          >
            <option value="All">
              All Status
            </option>

            {statusList.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}
          </select>

          {/* Sort */}

          <div className="flex gap-2">
            <div className="relative flex-1">
              <ArrowUpDown
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
                className="w-full appearance-none rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-gray-500"
              >
                <option value="newest">
                  Newest First
                </option>

                <option value="oldest">
                  Oldest First
                </option>

                <option value="name">
                  Name A-Z
                </option>

                <option value="species">
                  Species A-Z
                </option>
              </select>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animals */}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-200 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Registered Animals
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredAnimals.length} animal
              {filteredAnimals.length !==
              1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="p-10 text-center text-gray-500">
            Loading animals...
          </div>
        )}

        {/* Empty */}

        {!loading &&
          filteredAnimals.length ===
            0 && (
            <div className="p-12 text-center">
              <Dog
                size={48}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No animals found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

        {/* Desktop Table */}

        {!loading &&
          filteredAnimals.length > 0 && (
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Animal
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Species
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Breed
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Gender
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Location
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAnimals.map(
                    (animal) => (
                      <tr
                        key={animal._id}
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {animal.name ||
                                "Unnamed"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {
                                animal.animal_id
                              }
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {animal.species ||
                            "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {animal.breed ||
                            "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {animal.gender ||
                            "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {animal.location ||
                            "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {animal.status ||
                              "Unknown"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/animals/${animal.animal_id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                          >
                            <Eye
                              size={16}
                            />

                            View
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

        {/* Mobile Cards */}

        {!loading &&
          filteredAnimals.length > 0 && (
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredAnimals.map(
                (animal) => (
                  <div
                    key={animal._id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {animal.name ||
                            "Unnamed"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {
                            animal.animal_id
                          }
                        </p>
                      </div>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {animal.status ||
                          "Unknown"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">
                          Species
                        </p>

                        <p className="font-medium text-gray-900">
                          {animal.species ||
                            "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">
                          Breed
                        </p>

                        <p className="font-medium text-gray-900">
                          {animal.breed ||
                            "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">
                          Gender
                        </p>

                        <p className="font-medium text-gray-900">
                          {animal.gender ||
                            "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">
                          Location
                        </p>

                        <p className="font-medium text-gray-900">
                          {animal.location ||
                            "-"}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/animals/${animal.animal_id}`}
                      className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white"
                    >
                      <Eye size={17} />

                      View Animal Details
                    </Link>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default Animals;