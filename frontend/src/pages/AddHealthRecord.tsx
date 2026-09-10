import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      await api.post("/health/", {
        animal_id: animalId,
        ...formData,
      });

      alert("Health record added successfully!");

      navigate(`/animals/${animalId}/health`);
    } catch (error) {
      console.error(error);

      alert("Failed to add health record.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 shadow-sm">

      <h1 className="mb-2 text-3xl font-bold">
        Add Health Record
      </h1>

      <p className="mb-8 text-gray-600">
        Record a medical treatment for this animal.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div>
          <label className="mb-2 block font-medium">
            Date
          </label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Condition
          </label>

          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
            placeholder="Example: Leg Injury"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Treatment
          </label>

          <input
            type="text"
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
            placeholder="Bandage and Cleaning"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Medicine
          </label>

          <input
            type="text"
            name="medicine"
            value={formData.medicine}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            placeholder="Amoxicillin"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Doctor
          </label>

          <input
            type="text"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            placeholder="Dr. Sharma"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Next Visit
          </label>

          <input
            type="date"
            name="next_visit"
            value={formData.next_visit}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Notes
          </label>

          <textarea
            rows={5}
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            placeholder="Additional observations..."
          />
        </div>

        <div className="flex gap-4">

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Record"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border px-6 py-3"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddHealthRecord;