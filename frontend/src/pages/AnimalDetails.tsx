import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Dog,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Utensils,
  Camera,
  Siren,
} from "lucide-react";

import api from "../services/api";

interface Animal {
  _id: string;
  animal_id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  age: number;
  weight: number;
  color: string;
  vaccinated: boolean;
  sterilized: boolean;
  health_status: string;
  diet: string;
  location: string;
  description: string;
  image_url: string;
}

function AnimalDetails() {
  const { animalId } = useParams();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnimal();
  }, [animalId]);

  async function fetchAnimal() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/animals/${animalId}`);

      setAnimal(response.data);
    } catch (error) {
      console.error("Error fetching animal:", error);

      setError("Unable to load this animal.");
    } finally {
      setLoading(false);
    }
  }

  function getHealthStyle(status: string) {
    if (status === "Healthy") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Injured") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Under Treatment") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Critical") {
      return "bg-red-200 text-red-800";
    }

    return "bg-gray-100 text-gray-700";
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="text-gray-600">
          Loading animal details...
        </p>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-red-600">
          Animal not found
        </h2>

        <p className="mt-2 text-gray-500">
          {error || "The requested animal could not be found."}
        </p>

        <Link
          to="/animals"
          className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white"
        >
          Back to Animals
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Back button */}
      <Link
        to="/animals"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={18} />
        Back to Animals
      </Link>

      {/* Main animal profile */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div className="flex items-center gap-5">

              {/* Animal image / placeholder */}
              {animal.image_url ? (
                <img
                  src={animal.image_url}
                  alt={animal.name}
                  className="h-28 w-28 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-gray-100">
                  <Dog
                    size={44}
                    className="text-gray-500"
                  />
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {animal.name}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getHealthStyle(
                      animal.health_status
                    )}`}
                  >
                    {animal.health_status}
                  </span>
                </div>

                <p className="mt-2 text-gray-600">
                  {animal.species} • {animal.breed}
                </p>

                <p className="mt-2 font-mono text-sm text-gray-500">
                  {animal.animal_id || "No Vrinda ID"}
                </p>
              </div>
            </div>

          </div>

          {/* Basic details */}
          <div className="mt-8 border-t border-gray-200 pt-8">

            <h2 className="text-xl font-semibold text-gray-900">
              Basic Information
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              <InfoItem
                label="Species"
                value={animal.species}
              />

              <InfoItem
                label="Breed"
                value={animal.breed}
              />

              <InfoItem
                label="Gender"
                value={animal.gender}
              />

              <InfoItem
                label="Age"
                value={`${animal.age} years`}
              />

              <InfoItem
                label="Weight"
                value={`${animal.weight} kg`}
              />

              <InfoItem
                label="Color"
                value={animal.color}
              />

              <InfoItem
                label="Vaccinated"
                value={animal.vaccinated ? "Yes" : "No"}
              />

              <InfoItem
                label="Sterilized"
                value={animal.sterilized ? "Yes" : "No"}
              />

            </div>
          </div>

          {/* Location and diet */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div className="rounded-xl bg-gray-50 p-5">
              <div className="flex items-center gap-3">
                <MapPin size={20} />

                <h3 className="font-semibold">
                  Current Location
                </h3>
              </div>

              <p className="mt-3 text-gray-600">
                {animal.location}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <div className="flex items-center gap-3">
                <Utensils size={20} />

                <h3 className="font-semibold">
                  Current Diet
                </h3>
              </div>

              <p className="mt-3 text-gray-600">
                {animal.diet}
              </p>
            </div>

          </div>

          {/* Description */}
          <div className="mt-8">

            <h2 className="text-xl font-semibold">
              Description
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {animal.description || "No description available."}
            </p>

          </div>

        </div>
      </div>

      {/* Future modules */}
      <div className="grid gap-6 md:grid-cols-2">

        <ProfileSection
          icon={<HeartPulse size={22} />}
          title="Health Records"
          description="No health records added yet."
        />

        <ProfileSection
          icon={<ShieldCheck size={22} />}
          title="Vaccinations"
          description="No vaccination records added yet."
        />

        <ProfileSection
          icon={<Utensils size={22} />}
          title="Diet History"
          description="No diet history added yet."
        />

        <ProfileSection
          icon={<Siren size={22} />}
          title="Rescue History"
          description="No rescue cases recorded yet."
        />

        <ProfileSection
          icon={<Camera size={22} />}
          title="Photos"
          description="No additional photos uploaded yet."
        />

      </div>

    </div>
  );
}


interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}


interface ProfileSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ProfileSection({
  icon,
  title,
  description,
}: ProfileSectionProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gray-100 p-2">
          {icon}
        </div>

        <h2 className="text-lg font-semibold">
          {title}
        </h2>
      </div>

      <p className="mt-5 text-sm text-gray-500">
        {description}
      </p>

    </div>
  );
}

export default AnimalDetails;