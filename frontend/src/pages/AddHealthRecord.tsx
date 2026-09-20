import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";

function AddHealthRecord() {
  const { animalId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    condition: "",
    treatment: "",
    medicine: "",
    doctor: "",
    next_visit: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!animalId) {
      alert("Animal ID is missing.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/health/", {
        animal_id: animalId,
        date: formData.date,
        condition: formData.condition,
        treatment: formData.treatment,
        medicine: formData.medicine,
        doctor: formData.doctor,
        next_visit: formData.next_visit,
        notes: formData.notes,
      });

      alert("Health record added successfully!");

      navigate(
        `/animals/${animalId}/health`
      );
    } catch (error) {
      console.error(
        "Error adding health record:",
        error
      );

      alert(
        "Unable to add health record."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Add Health Record
          </h1>

          <p className="mt-2 text-gray-600">
            Record medical information for this animal.
          </p>
        </div>

        <Link
          to={`/animals/${animalId}/health`}
          className="rounded-lg border px-5 py-3 hover:bg-gray-100"
        >
          Back
        </Link>

      </div>

      {/* Form */}
      <div className="rounded-xl border bg-white p-8 shadow-sm">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Condition */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Condition
            </label>

            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              placeholder="Example: Fever, Injury, Healthy"
              required
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Treatment */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Treatment
            </label>

            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              placeholder="Describe the treatment provided"
              required
              rows={3}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Medicine */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Medicine
            </label>

            <input
              type="text"
              name="medicine"
              value={formData.medicine}
              onChange={handleChange}
              placeholder="Example: Antibiotic"
              required
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Doctor */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Doctor
            </label>

            <input
              type="text"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              placeholder="Veterinarian name"
              required
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Next Visit */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Next Visit
            </label>

            <input
              type="date"
              name="next_visit"
              value={formData.next_visit}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional medical notes"
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 border-t pt-6">

            <Link
              to={`/animals/${animalId}/health`}
              className="rounded-lg border px-6 py-3 hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : "Save Health Record"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddHealthRecord;