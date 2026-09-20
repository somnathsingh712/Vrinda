import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function AddVaccination() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    animal_id: "",
    vaccine_name: "",
    date_given: "",
    next_due_date: "",
    veterinarian: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      await api.post("/vaccinations/", formData);

      navigate("/vaccinations");
    } catch (error) {
      console.error(
        "Error adding vaccination:",
        error
      );

      alert("Failed to add vaccination record.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Add Vaccination
        </h1>

        <p className="mt-2 text-gray-600">
          Add a vaccination record for an animal
        </p>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Animal ID */}
          <div>
            <label
              htmlFor="animal_id"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Animal ID
            </label>

            <input
              id="animal_id"
              name="animal_id"
              type="text"
              value={formData.animal_id}
              onChange={handleChange}
              placeholder="e.g. VRD-20260904205604"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Vaccine Name */}
          <div>
            <label
              htmlFor="vaccine_name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Vaccine Name
            </label>

            <input
              id="vaccine_name"
              name="vaccine_name"
              type="text"
              value={formData.vaccine_name}
              onChange={handleChange}
              placeholder="e.g. Rabies"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Dates */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="date_given"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Date Given
              </label>

              <input
                id="date_given"
                name="date_given"
                type="date"
                value={formData.date_given}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="next_due_date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Next Due Date
              </label>

              <input
                id="next_due_date"
                name="next_due_date"
                type="date"
                value={formData.next_due_date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Veterinarian */}
          <div>
            <label
              htmlFor="veterinarian"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Veterinarian
            </label>

            <input
              id="veterinarian"
              name="veterinarian"
              type="text"
              value={formData.veterinarian}
              onChange={handleChange}
              placeholder="e.g. Dr. Rahul"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional vaccination details..."
              rows={5}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : "Save Vaccination"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/vaccinations")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVaccination;