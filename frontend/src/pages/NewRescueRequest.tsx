import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NewRescueRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reporter_name: "",
    phone: "",
    animal_type: "",
    description: "",
    location: "",
    urgency: "Medium",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
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
      await api.post("/rescue/", formData);

      alert("Rescue request created successfully!");

      navigate("/rescue");
    } catch (error) {
      console.error(error);
      alert("Unable to create rescue request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold">
        New Rescue Request
      </h1>

      <p className="mt-2 text-gray-600">
        Create a new rescue request.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-xl border bg-white p-8 shadow-sm"
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block font-medium">
              Reporter Name
            </label>

            <input
              type="text"
              name="reporter_name"
              value={formData.reporter_name}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="Enter reporter name"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Animal Type
            </label>

            <input
              type="text"
              name="animal_type"
              value={formData.animal_type}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="Dog, Cat, Cow..."
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Urgency
            </label>

            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block font-medium">
            Location
          </label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            placeholder="Enter rescue location"
            required
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-lg border p-3"
            placeholder="Describe the situation..."
            required
          />
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-red-600 px-6 py-3 text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Rescue Request"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/rescue")}
            className="rounded-lg border border-gray-300 px-6 py-3 transition hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewRescueRequest;