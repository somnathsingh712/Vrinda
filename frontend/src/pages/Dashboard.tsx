import { useEffect, useState } from "react";
import {
  Dog,
  HeartPulse,
  ShieldCheck,
  Siren,
  Users,
  Plus,
  Ambulance,
  AlertTriangle,
  UserCheck,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";

import api from "../services/api";

interface Animal {
  _id: string;
  animal_id: string;
  name?: string;
  species: string;
  status?: string;
  created_at?: string;
}

interface RescueRequest {
  _id: string;
  request_id: string;
  animal_type: string;
  location: string;
  description: string;
  status: string;
  created_at?: string;
}

interface Volunteer {
  _id: string;
  volunteer_id: string;
  name: string;
  status: string;
  availability: string;
}

interface HealthRecord {
  _id: string;
  animal_id: string;
  date: string;
  condition: string;
  treatment: string;
  medicine: string;
  doctor: string;
  next_visit: string;
  notes: string;
}

interface Vaccination {
  _id: string;
  vaccination_id?: string;
  animal_id: string;
  vaccine_name: string;
  date_given: string;
  next_due_date: string;
  veterinarian: string;
  notes: string;
}

function Dashboard() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [rescueRequests, setRescueRequests] = useState<
    RescueRequest[]
  >([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [healthRecords, setHealthRecords] = useState<
    HealthRecord[]
  >([]);
  const [vaccinations, setVaccinations] = useState<
    Vaccination[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [
        animalsResponse,
        rescueResponse,
        volunteerResponse,
        healthResponse,
        vaccinationResponse,
      ] = await Promise.all([
        api.get("/animals/"),
        api.get("/rescue/"),
        api.get("/volunteers/"),
        api.get("/health/all"),
        api.get("/vaccinations/"),
      ]);

      setAnimals(animalsResponse.data);
      setRescueRequests(rescueResponse.data);
      setVolunteers(volunteerResponse.data);
      setHealthRecords(healthResponse.data);
      setVaccinations(vaccinationResponse.data);
    } catch (error) {
      console.error(
        "Error fetching dashboard data:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function getToday() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today;
  }

  function getDaysFromToday(dateString: string) {
    if (!dateString) {
      return null;
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    date.setHours(0, 0, 0, 0);

    const today = getToday();

    const difference =
      date.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  /*
   * Statistics
   */

  const activeRescueCases =
    rescueRequests.filter(
      (request) =>
        request.status !== "Completed"
    ).length;

  const activeVolunteers =
    volunteers.filter(
      (volunteer) =>
        volunteer.status === "Active"
    ).length;

  const vaccinatedAnimals = new Set(
    vaccinations.map(
      (vaccination) =>
        vaccination.animal_id
    )
  ).size;

  const animalsWithHealthRecords =
    new Set(
      healthRecords.map(
        (record) =>
          record.animal_id
      )
    ).size;

  const stats = [
    {
      title: "Total Animals",
      value: animals.length,
      icon: Dog,
    },
    {
      title: "Animals With Health Records",
      value: animalsWithHealthRecords,
      icon: HeartPulse,
    },
    {
      title: "Vaccinated Animals",
      value: vaccinatedAnimals,
      icon: ShieldCheck,
    },
    {
      title: "Active Rescue Cases",
      value: activeRescueCases,
      icon: Siren,
    },
  ];

  /*
   * Alerts
   */

  const pendingRescues =
    rescueRequests.filter(
      (request) =>
        request.status === "Pending"
    );

  const waitingForVolunteer =
    rescueRequests.filter(
      (request) =>
        request.status === "Accepted"
    );

  const availableVolunteers =
    volunteers.filter(
      (volunteer) =>
        volunteer.status === "Active" &&
        volunteer.availability ===
          "Available"
    );

  const overdueHealthVisits =
    healthRecords.filter((record) => {
      const days = getDaysFromToday(
        record.next_visit
      );

      return days !== null && days < 0;
    });

  const upcomingHealthVisits =
    healthRecords.filter((record) => {
      const days = getDaysFromToday(
        record.next_visit
      );

      return (
        days !== null &&
        days >= 0 &&
        days <= 30
      );
    });

  const overdueVaccinations =
    vaccinations.filter((vaccination) => {
      const days = getDaysFromToday(
        vaccination.next_due_date
      );

      return days !== null && days < 0;
    });

  const upcomingVaccinations =
    vaccinations.filter((vaccination) => {
      const days = getDaysFromToday(
        vaccination.next_due_date
      );

      return (
        days !== null &&
        days >= 0 &&
        days <= 30
      );
    });

  /*
   * Analytics
   */

  const speciesCount: Record<
    string,
    number
  > = {};

  animals.forEach((animal) => {
    const species =
      animal.species || "Unknown";

    speciesCount[species] =
      (speciesCount[species] || 0) + 1;
  });

  const speciesData = Object.entries(
    speciesCount
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const rescueStatusCount: Record<
    string,
    number
  > = {};

  rescueRequests.forEach((request) => {
    const status =
      request.status || "Unknown";

    rescueStatusCount[status] =
      (rescueStatusCount[status] || 0) + 1;
  });

  const rescueStatusData = Object.entries(
    rescueStatusCount
  ).map(([status, count]) => ({
    status,
    count,
  }));

  const volunteerData = [
    {
      name: "Available",
      count: volunteers.filter(
        (volunteer) =>
          volunteer.status === "Active" &&
          volunteer.availability ===
            "Available"
      ).length,
    },
    {
      name: "Busy",
      count: volunteers.filter(
        (volunteer) =>
          volunteer.status === "Active" &&
          volunteer.availability ===
            "Busy"
      ).length,
    },
    {
      name: "Inactive",
      count: volunteers.filter(
        (volunteer) =>
          volunteer.status !== "Active"
      ).length,
    },
  ];

  const careCoverageData = [
    {
      name: "Health Records",
      count: animalsWithHealthRecords,
    },
    {
      name: "Vaccinated",
      count: vaccinatedAnimals,
    },
    {
      name: "No Health Record",
      count:
        animals.length -
        animalsWithHealthRecords,
    },
    {
      name: "Not Vaccinated",
      count:
        animals.length -
        vaccinatedAnimals,
    },
  ];

  const recentAnimals =
    animals.slice(0, 5);

  const recentRescues =
    rescueRequests.slice(0, 5);

  return (
    <div>
      {/* Header */}

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gray-900 p-3">
            <BarChart3
              size={26}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>

            <p className="mt-1 text-gray-600">
              Welcome to Vrinda Animal Welfare Platform.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {loading
                      ? "..."
                      : stat.value}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-100 p-3">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Quick Actions
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/animals/register"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="rounded-lg bg-gray-100 p-3">
              <Plus size={22} />
            </div>

            <div>
              <p className="font-semibold">
                Register Animal
              </p>

              <p className="text-sm text-gray-500">
                Add a new animal
              </p>
            </div>
          </Link>

          <Link
            to="/rescue/new"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="rounded-lg bg-gray-100 p-3">
              <Ambulance size={22} />
            </div>

            <div>
              <p className="font-semibold">
                New Rescue
              </p>

              <p className="text-sm text-gray-500">
                Create rescue request
              </p>
            </div>
          </Link>

          <Link
            to="/volunteers/new"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="rounded-lg bg-gray-100 p-3">
              <Users size={22} />
            </div>

            <div>
              <p className="font-semibold">
                Add Volunteer
              </p>

              <p className="text-sm text-gray-500">
                Register a volunteer
              </p>
            </div>
          </Link>

          <Link
            to="/vaccinations/add"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="rounded-lg bg-gray-100 p-3">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="font-semibold">
                Add Vaccination
              </p>

              <p className="text-sm text-gray-500">
                Record vaccination
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Alerts & Attention */}

      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Alerts & Attention
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Important cases and upcoming animal care activities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {/* Pending Rescues */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-3">
                  <AlertTriangle
                    size={22}
                    className="text-red-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Pending Rescues
                  </h3>

                  <p className="text-sm text-gray-500">
                    Waiting for acceptance
                  </p>
                </div>
              </div>

              <span className="text-2xl font-bold text-red-600">
                {loading
                  ? "..."
                  : pendingRescues.length}
              </span>
            </div>

            {pendingRescues.length > 0 && (
              <div className="mt-5 space-y-3">
                {pendingRescues
                  .slice(0, 3)
                  .map((request) => (
                    <Link
                      key={request._id}
                      to={`/rescue/${request.request_id}`}
                      className="block rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
                    >
                      <p className="font-medium">
                        {request.animal_type}
                      </p>

                      <p className="text-sm text-gray-500">
                        {request.location}
                      </p>
                    </Link>
                  ))}
              </div>
            )}

            <Link
              to="/rescue"
              className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              View Rescue Requests →
            </Link>
          </div>

          {/* Waiting for Volunteer */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-yellow-100 p-3">
                  <Users
                    size={22}
                    className="text-yellow-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Waiting for Volunteer
                  </h3>

                  <p className="text-sm text-gray-500">
                    Accepted rescue requests
                  </p>
                </div>
              </div>

              <span className="text-2xl font-bold text-yellow-600">
                {loading
                  ? "..."
                  : waitingForVolunteer.length}
              </span>
            </div>

            {waitingForVolunteer.length > 0 && (
              <div className="mt-5 space-y-3">
                {waitingForVolunteer
                  .slice(0, 3)
                  .map((request) => (
                    <Link
                      key={request._id}
                      to={`/rescue/${request.request_id}`}
                      className="block rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
                    >
                      <p className="font-medium">
                        {request.animal_type}
                      </p>

                      <p className="text-sm text-gray-500">
                        {request.location}
                      </p>
                    </Link>
                  ))}
              </div>
            )}

            <Link
              to="/rescue"
              className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Manage Rescue Requests →
            </Link>
          </div>

          {/* Available Volunteers */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3">
                  <UserCheck
                    size={22}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Available Volunteers
                  </h3>

                  <p className="text-sm text-gray-500">
                    Ready for rescue work
                  </p>
                </div>
              </div>

              <span className="text-2xl font-bold text-green-600">
                {loading
                  ? "..."
                  : availableVolunteers.length}
              </span>
            </div>

            {availableVolunteers.length > 0 && (
              <div className="mt-5 space-y-3">
                {availableVolunteers
                  .slice(0, 3)
                  .map((volunteer) => (
                    <Link
                      key={volunteer._id}
                      to={`/volunteers/${volunteer.volunteer_id}`}
                      className="block rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
                    >
                      <p className="font-medium">
                        {volunteer.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {volunteer.volunteer_id}
                      </p>
                    </Link>
                  ))}
              </div>
            )}

            <Link
              to="/volunteers"
              className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              View Volunteers →
            </Link>
          </div>

          {/* Health Visits */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-3">
                  <HeartPulse
                    size={22}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Health Visits
                  </h3>

                  <p className="text-sm text-gray-500">
                    Next 30 days
                  </p>
                </div>
              </div>

              <span className="text-2xl font-bold text-blue-600">
                {loading
                  ? "..."
                  : upcomingHealthVisits.length}
              </span>
            </div>

            {overdueHealthVisits.length > 0 && (
              <div className="mt-4 rounded-lg bg-red-50 p-3">
                <p className="text-sm font-medium text-red-700">
                  {overdueHealthVisits.length} overdue
                  health visit
                  {overdueHealthVisits.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>
            )}

            {upcomingHealthVisits.length > 0 && (
              <div className="mt-4 space-y-3">
                {upcomingHealthVisits
                  .slice(0, 3)
                  .map((record) => (
                    <Link
                      key={record._id}
                      to={`/animals/${record.animal_id}/health`}
                      className="block rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
                    >
                      <p className="font-medium">
                        Animal:{" "}
                        {record.animal_id}
                      </p>

                      <p className="text-sm text-gray-500">
                        Visit:{" "}
                        {record.next_visit}
                      </p>
                    </Link>
                  ))}
              </div>
            )}

            {upcomingHealthVisits.length === 0 &&
              overdueHealthVisits.length === 0 && (
                <p className="mt-5 text-sm text-gray-500">
                  No health visits requiring attention.
                </p>
              )}

            <Link
              to="/health"
              className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              View Health Records →
            </Link>
          </div>

          {/* Vaccinations */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-3">
                  <ShieldCheck
                    size={22}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Vaccinations
                  </h3>

                  <p className="text-sm text-gray-500">
                    Next 30 days
                  </p>
                </div>
              </div>

              <span className="text-2xl font-bold text-purple-600">
                {loading
                  ? "..."
                  : upcomingVaccinations.length}
              </span>
            </div>

            {overdueVaccinations.length > 0 && (
              <div className="mt-4 rounded-lg bg-red-50 p-3">
                <p className="text-sm font-medium text-red-700">
                  {overdueVaccinations.length} overdue
                  vaccination
                  {overdueVaccinations.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>
            )}

            {upcomingVaccinations.length > 0 && (
              <div className="mt-4 space-y-3">
                {upcomingVaccinations
                  .slice(0, 3)
                  .map((vaccination) => (
                    <Link
                      key={vaccination._id}
                      to={`/animals/${vaccination.animal_id}/vaccinations`}
                      className="block rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
                    >
                      <p className="font-medium">
                        {vaccination.vaccine_name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Animal:{" "}
                        {vaccination.animal_id}
                      </p>

                      <p className="text-sm text-gray-500">
                        Due:{" "}
                        {vaccination.next_due_date}
                      </p>
                    </Link>
                  ))}
              </div>
            )}

            {upcomingVaccinations.length === 0 &&
              overdueVaccinations.length === 0 && (
                <p className="mt-5 text-sm text-gray-500">
                  No vaccinations requiring attention.
                </p>
              )}

            <Link
              to="/vaccinations"
              className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              View Vaccinations →
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics */}

      <div className="mt-10">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Analytics Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Visual overview of animals, rescues, volunteers, and care.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">

          {/* Species Distribution */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Animal Species Distribution
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Number of registered animals by species.
            </p>

            <div className="mt-6 h-80">
              {speciesData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No animal data available.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={speciesData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {speciesData.map(
                        (_, index) => (
                          <Cell
                            key={`species-${index}`}
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Rescue Status */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Rescue Request Status
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Current status of rescue requests.
            </p>

            <div className="mt-6 h-80">
              {rescueStatusData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No rescue data available.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={rescueStatusData}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis dataKey="status" />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Bar
                      dataKey="count"
                      name="Requests"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Volunteer Availability */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Volunteer Availability
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Current volunteer availability.
            </p>

            <div className="mt-6 h-80">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={volunteerData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    name="Volunteers"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Animal Care Coverage */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Animal Care Coverage
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Health and vaccination coverage across animals.
            </p>

            <div className="mt-6 h-80">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={careCoverageData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    angle={-15}
                    textAnchor="end"
                    height={70}
                  />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    name="Animals"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Volunteers
          </p>

          <p className="mt-2 text-3xl font-bold">
            {loading
              ? "..."
              : activeVolunteers}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Health Records
          </p>

          <p className="mt-2 text-3xl font-bold">
            {loading
              ? "..."
              : healthRecords.length}
          </p>
        </div>
      </div>

      {/* Recent Animals */}

      <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Animals
          </h2>

          <Link
            to="/animals"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">
            Loading animals...
          </p>
        ) : recentAnimals.length === 0 ? (
          <p className="p-6 text-gray-500">
            No animals to display yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentAnimals.map((animal) => (
              <Link
                key={animal._id}
                to={`/animals/${animal.animal_id}`}
                className="flex items-center justify-between p-6 transition hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold">
                    {animal.name ||
                      animal.animal_id}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {animal.species}
                  </p>
                </div>

                <span className="text-sm text-gray-500">
                  {animal.animal_id}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Rescue Requests */}

      <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Rescue Requests
          </h2>

          <Link
            to="/rescue"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">
            Loading rescue requests...
          </p>
        ) : recentRescues.length === 0 ? (
          <p className="p-6 text-gray-500">
            No rescue requests yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentRescues.map((request) => (
              <Link
                key={request._id}
                to={`/rescue/${request.request_id}`}
                className="flex items-center justify-between p-6 transition hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold">
                    {request.animal_type}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {request.location}
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                  {request.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;