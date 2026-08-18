import { useState } from "react";
import api from "../services/api";

function PersonDetails({ person, onBack }) {
  const [currentPerson, setCurrentPerson] = useState(person);
  const [showForm, setShowForm] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    status: "pending",
    remark: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddFollowUp = () => {
    setEditingFollowUp(null);
    setFormData({
      date: "",
      status: "pending",
      remark: "",
    });
    setShowForm(true);
  };

  const handleEditFollowUp = (followUp) => {
    setEditingFollowUp(followUp);
    setFormData({
      date: followUp.date ? followUp.date.substring(0, 10) : "",
      status: followUp.status || "pending",
      remark: followUp.remark || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.date) {
      alert("Please select a date.");
      return;
    }

    if (!formData.status) {
      alert("Please select a status.");
      return;
    }

    if (editingFollowUp) {
      try {
        const response = await api.put(
          `/people/${currentPerson._id}/followups/${editingFollowUp._id}`,
          formData
        );
        setCurrentPerson(response.data.data);
        alert("Follow-up updated successfully.");
        setShowForm(false);
        setEditingFollowUp(null);
      } catch (error) {
        console.error("Update follow-up failed:", error);
        alert("Failed to update follow-up.");
      }
    } else {
      try {
        const response = await api.post(
          `/people/${currentPerson._id}/followups`,
          formData
        );
        setCurrentPerson(response.data.data);
        alert("Follow-up added successfully.");
        setShowForm(false);
      } catch (error) {
        console.error("Add follow-up failed:", error);
        alert("Failed to add follow-up.");
      }
    }
  };

  const handleDeleteFollowUp = async (followUpId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this follow-up?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.delete(
        `/people/${currentPerson._id}/followups/${followUpId}`
      );
      setCurrentPerson(response.data.data);
      alert("Follow-up deleted successfully.");
    } catch (error) {
      console.error("Delete follow-up failed:", error);
      alert("Failed to delete follow-up.");
    }
  };

  const handleCopyContact = async () => {
    try {
      await navigator.clipboard.writeText(currentPerson.contactNo);
      alert("Contact number copied.");
    } catch (error) {
      console.error(error);
      alert("Could not copy contact number.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased pb-16">
      {/* Top App Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex h-9 items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 shadow-xs transition-all duration-150 hover:border-indigo-300 hover:bg-indigo-100 hover:text-indigo-800 active:scale-[0.98] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:h-10 sm:px-4 sm:text-sm"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Contacts</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] sm:text-xs">
              ID
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              {currentPerson._id?.slice(-6) || "N/A"}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6 sm:py-8 sm:space-y-6">
        {/* Contact Overview Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="border-b border-slate-100 bg-slate-50/60 p-4.5 sm:p-6">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-indigo-500 font-bold text-white shadow-sm shadow-indigo-200">
                  {currentPerson.name ? currentPerson.name.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold text-slate-900 sm:text-2xl">
                    {currentPerson.name || "Unnamed Contact"}
                  </h1>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Invited By:{" "}
                    <span className="font-medium text-slate-800">
                      {currentPerson.invitedBy || "None"}
                    </span>
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                {currentPerson.status || "Active"}
              </span>
            </div>
          </div>

          <div className="space-y-4 p-4.5 sm:p-6 sm:space-y-5">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 sm:p-4">
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Contact Number
                </span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-slate-900">
                    {currentPerson.contactNo || "Unavailable"}
                  </span>
                  {currentPerson.contactNo && (
                    <button
                      type="button"
                      onClick={handleCopyContact}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 text-xs font-semibold text-indigo-700 shadow-xs transition-all duration-150 hover:bg-indigo-100 active:scale-[0.98] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <svg
                        className="h-3.5 w-3.5 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Copy</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 sm:p-4">
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Location
                </span>
                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="truncate">{currentPerson.location || "Not specified"}</span>
                </div>
              </div>
            </div>

            {/* Health Challenges */}
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                Health Challenges
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {currentPerson.healthChallenges?.length > 0 ? (
                  currentPerson.healthChallenges.map((challenge) => (
                    <span
                      key={challenge}
                      className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20"
                    >
                      {challenge}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-medium text-slate-400">None reported</span>
                )}
              </div>
            </div>

            {/* Other Health Problem */}
            {currentPerson.otherHealthProblem && (
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 sm:p-4">
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Other Conditions
                </span>
                <p className="mt-1 text-xs leading-relaxed text-slate-700 sm:text-sm">
                  {currentPerson.otherHealthProblem}
                </p>
              </div>
            )}

            {/* General Notes */}
            {currentPerson.remark && (
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 sm:p-4">
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  General Notes
                </span>
                <p className="mt-1 text-xs leading-relaxed text-slate-700 sm:text-sm">
                  {currentPerson.remark}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Touchpoint Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs sm:p-6">
          <div className="mb-5 flex flex-col gap-3.5 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">Touchpoint Logs</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Track interactions, scheduled syncs, and status updates
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddFollowUp}
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-xs shadow-indigo-200 transition-all duration-150 hover:bg-indigo-700 active:scale-[0.98] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto sm:text-sm"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Log Follow-Up</span>
            </button>
          </div>

          {/* Form Modal / Inset Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 sm:p-5"
            >
              <h3 className="mb-4 text-sm font-bold text-slate-900">
                {editingFollowUp ? "Update Follow-Up Log" : "Log New Touchpoint"}
              </h3>

              <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Scheduled Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-xs transition duration-150 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-xs transition duration-150 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Notes & Outcomes
                </label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter conversation notes, updates, or next steps..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition duration-150 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFollowUp(null);
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-xs transition duration-150 hover:bg-slate-50 active:scale-[0.98] focus:outline-none sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 text-xs font-semibold text-white shadow-xs shadow-indigo-200 transition duration-150 hover:bg-indigo-700 active:scale-[0.98] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                >
                  {editingFollowUp ? "Save Changes" : "Create Entry"}
                </button>
              </div>
            </form>
          )}

          {/* Timeline & List View */}
          {!currentPerson.followUps || currentPerson.followUps.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">No follow-ups recorded</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Start logging your touches with this contact by tapping the button above.
              </p>
            </div>
          ) : (
            <div className="relative space-y-4 pl-5 sm:pl-6 before:absolute before:top-2.5 before:bottom-2.5 before:left-2 before:w-0.5 before:bg-slate-200">
              {currentPerson.followUps.map((followUp, index) => {
                const isCompleted = followUp.status === "completed";
                const isCancelled = followUp.status === "cancelled";
                const statusColor = isCompleted
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                  : isCancelled
                  ? "bg-rose-50 text-rose-700 ring-rose-600/20"
                  : "bg-amber-50 text-amber-700 ring-amber-600/20";

                return (
                  <div key={followUp._id} className="relative">
                    {/* Node Dot */}
                    <div className="absolute -left-6.25 sm:-left-6.75 top-3 h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-600 ring-4 ring-slate-100" />

                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-150 hover:border-slate-300">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 sm:text-sm">
                            Log #{followUp.followUpNumber || index + 1}
                          </span>
                          <span className="text-xs text-slate-300">•</span>
                          <span className="text-xs font-medium text-slate-500">
                            {followUp.date
                              ? new Date(followUp.date).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "-"}
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusColor}`}
                        >
                          {followUp.status.charAt(0).toUpperCase() + followUp.status.slice(1)}
                        </span>
                      </div>

                      {followUp.remark && (
                        <p className="mt-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
                          {followUp.remark}
                        </p>
                      )}

                      {/* Standardized Colored Action Buttons */}
                      <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => handleEditFollowUp(followUp)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 shadow-xs transition duration-150 hover:bg-indigo-100 active:scale-[0.98] focus:outline-none"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteFollowUp(followUp._id)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 shadow-xs transition duration-150 hover:bg-rose-100 active:scale-[0.98] focus:outline-none"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PersonDetails;