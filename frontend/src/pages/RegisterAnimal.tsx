import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RegisterAnimal() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    age: "",
    weight: "",
    color: "",
    vaccinated: false,
    sterilized: false,
    health_status: "",
    diet: "",
    location: "",
    description: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const target = event.target as HTMLInputElement;

      setFormData({
        ...formData,
        [name]: target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
      };

      const response = await api.post(
        "/animals/",
        payload
      );

      setMessage(
        `Animal registered successfully. ID: ${response.data.animal_id}`
      );

      setTimeout(() => {
        navigate("/animals");
      }, 1500);
    } catch (error) {
      console.error(
        "Error registering animal:",
        error
      );

      setMessage(
        "Failed to register animal."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Register Animal
        </h1>

        <p className="mt-2 text-gray-600">
          Create a new animal profile in Vrinda.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              placeholder="Example: Moti"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Species
            </label>

            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value="">
                Select species
              </option>

              <option value="Dog">
                Dog
              </option>

              <option value="Cat">
                Cat
              </option>

              <option value="Cow">
                Cow
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Breed
            </label>

            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Example: Indian Pariah"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value="">
                Select gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Unknown">
                Unknown
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Age
            </label>

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Age in years"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Weight
            </label>

            <input
              type="number"
              step="0.1"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              min="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Weight in kg"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Color
            </label>

            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Example: Brown"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Health Status
            </label>

            <select
              name="health_status"
              value={formData.health_status}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value="">
                Select status
              </option>

              <option value="Healthy">
                Healthy
              </option>

              <option value="Injured">
                Injured
              </option>

              <option value="Under Treatment">
                Under Treatment
              </option>

              <option value="Critical">
                Critical
              </option>

              <option value="Unknown">
                Unknown
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Diet
            </label>

            <input
              type="text"
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Example: Rice and chicken"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Example: Sector 5"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Image URL
            </label>

            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Optional image URL"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Describe the animal..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="vaccinated"
              checked={formData.vaccinated}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <label className="text-sm font-medium">
              Vaccinated
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="sterilized"
              checked={formData.sterilized}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <label className="text-sm font-medium">
              Sterilized
            </label>
          </div>

        </div>

        {message && (
          <div className="mt-6 rounded-lg bg-gray-100 p-4 text-sm">
            {message}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Registering..."
              : "Register Animal"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterAnimal;