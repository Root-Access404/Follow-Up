import { useState } from "react";
import api from "../services/api";

const healthOptions = [
  "hypertension(BP)",
  "diabetes(sugar)",
  "thyroid",
  "pcod",
  "pcos",
  "gastric_problems",
  "joint_pain",
  "weight_gain",
  "weight_loss",
  "children_nutrition",
];

const getDateInputValue = (value) => {
  if (!value) return "";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().substring(0, 10);
};

function PersonForm({
  editingPerson = null,
  onPersonCreated,
  onPersonUpdated,
}) {
  const [formData, setFormData] = useState(() => ({
    name: editingPerson?.name || "",
    contactNo: editingPerson?.contactNo || "",
    location: editingPerson?.location || "",
    status: editingPerson?.status || "known",
    entryDate: getDateInputValue(editingPerson?.entryDate || editingPerson?.createdAt || new Date()),
    invitedBy: editingPerson?.invitedBy || "",
    healthChallenges: editingPerson?.healthChallenges || [],
    otherHealthProblem: editingPerson?.otherHealthProblem || "",
    remark: editingPerson?.remark || "",
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleHealthChange = (health) => {
    setFormData((previous) => {
      const alreadySelected = previous.healthChallenges.includes(health);
      if (alreadySelected) {
        return {
          ...previous,
          healthChallenges: previous.healthChallenges.filter(
            (item) => item !== health
          ),
        };
      }
      return {
        ...previous,
        healthChallenges: [...previous.healthChallenges, health],
      };
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.contactNo.trim()) return "Contact number is required.";
    if (!/^\d{10}$/.test(formData.contactNo))
      return "Contact number must contain exactly 10 digits.";
    if (!formData.location.trim()) return "Location is required.";
    if (!formData.invitedBy.trim()) return "Invited By is required.";
    if (formData.healthChallenges.length === 0)
      return "Please select at least one health challenge.";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      let response;
      if (editingPerson) {
        response = await api.put(`/people/${editingPerson._id}`, formData);
        alert("Customer updated successfully!");
        if (onPersonUpdated) {
          onPersonUpdated(response.data.data);
        }
      } else {
        response = await api.post("/people", formData);
        alert("Customer added successfully!");
        if (onPersonCreated) {
          onPersonCreated(response.data.data);
        }
        setFormData({
          name: "",
          contactNo: "",
          location: "",
          status: "known",
          entryDate: getDateInputValue(new Date()),
          invitedBy: "",
          healthChallenges: [],
          otherHealthProblem: "",
          remark: "",
        });
      }
    } catch (error) {
      console.error("Save customer failed:", error);
      setError(error.response?.data?.message || "Failed to save customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      {/* Header */}
      <div className="border-b border-slate-100 bg-blue-50/40 p-4.5 sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-xs">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              {editingPerson ? "Edit Contact" : "Add New Contact"}
            </h2>
            <p className="text-xs text-slate-500">
              Update your records with contact information.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4.5 sm:p-6">
        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 sm:text-sm">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Main Form Fields */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition duration-150 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Contact Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setFormData((previous) => ({
                        ...previous,
                        contactNo: value,
                      }));
                    }
                  }}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  inputMode="numeric"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pr-3.5 pl-10 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition duration-150 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Area or Region"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition duration-150 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Invited By <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="invitedBy"
                value={formData.invitedBy}
                onChange={handleChange}
                placeholder="Referral or referrer name"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition duration-150 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Pipeline Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-xs transition duration-150 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 focus:outline-none"
              >
                <option value="known">Known</option>
                <option value="unknown">Unknown</option>
                <option value="interested">Interested</option>
                <option value="not_interested">Not Interested</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Card Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="entryDate"
                value={formData.entryDate}
                onChange={handleChange}
                required
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-xs transition duration-150 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 focus:outline-none"
              />
            </div>
          </div>

          {/* Health Considerations Section */}
          <div className="border-t border-slate-100 pt-4.5">
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Health Considerations <span className="text-rose-500">*</span>
              </label>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/15">
                {formData.healthChallenges.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5">
              {healthOptions.map((health) => {
                const isChecked = formData.healthChallenges.includes(health);
                return (
                  <label
                    key={health}
                    className={`flex min-h-[42px] cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2 transition-all duration-150 select-none ${
                      isChecked
                        ? "border-blue-600 bg-blue-50/70 text-blue-950 ring-1 ring-blue-600/20"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleHealthChange(health)}
                      className="h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="text-xs font-semibold sm:text-sm">
                      {health
                        .replaceAll("_", " ")
                        .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="space-y-4 border-t border-slate-100 pt-4.5">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Other Specific Health Issues
              </label>
              <input
                type="text"
                name="otherHealthProblem"
                value={formData.otherHealthProblem}
                onChange={handleChange}
                placeholder="Specify any additional conditions..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition duration-150 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Internal Notes & Remarks
              </label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                rows="3"
                placeholder="Add any background context, goals, or preliminary notes..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition duration-150 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 focus:outline-none"
              />
            </div>
          </div>

          {/* Standardized Primary Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Saving record...</span>
                </>
              ) : (
                <span>{editingPerson ? "Update Contact" : "Save Contact"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PersonForm;