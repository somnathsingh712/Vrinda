import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NewVolunteer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    availability: "Available",
    skills: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      await api.post("/volunteers/", formData);

      alert("Volunteer added successfully!");

      navigate("/volunteers");
    } catch (error) {
      console.error("Error creating volunteer:", error);

      alert("Unable to add volunteer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Add Volunteer
        </h1>

        <p className="mt-2 text-gray-600">
          Register a new volunteer with the Vrinda platform.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter volunteer name"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-500"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-500"
              required
            />
          </div>

          {/* Availability */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Availability
            </label>

            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none"
            >
              <option value="Available">
                Available
              </option>

              <option value="Busy">
                Busy
              </option>

              <option value="Unavailable">
                Unavailable
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Skills
          </label>

          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Example: Animal rescue, First aid, Driving"
            rows={4}
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gray-900 px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Volunteer"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/volunteers")}
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewVolunteer;