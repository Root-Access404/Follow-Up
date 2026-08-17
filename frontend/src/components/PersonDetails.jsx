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
    <div className="min-h-screen bg-slate-100 pb-12 antialiased">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:text-sm sm:px-3.5 sm:py-2"
          >
            <svg className="h-4 w-4 transition group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Contacts
          </button>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-400 uppercase">Record ID:</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono font-medium text-slate-700">
              {currentPerson._id?.slice(-6) || "N/A"}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/50 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-200">
                  {currentPerson.name ? currentPerson.name.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {currentPerson.name}
                  </h1>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Invited By: <span className="font-medium text-slate-700">{currentPerson.invitedBy || "None"}</span>
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                {currentPerson.status || "Active"}
              </span>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Contact Number</span>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    {currentPerson.contactNo || "Unavailable"}
                  </span>
                  {currentPerson.contactNo && (
                    <button
                      onClick={handleCopyContact}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 focus:outline-none"
                    >
                      <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Location</span>
                <div className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{currentPerson.location || "Not specified"}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Health Challenges</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {currentPerson.healthChallenges?.length > 0 ? (
                  currentPerson.healthChallenges.map((challenge) => (
                    <span
                      key={challenge}
                      className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10"
                    >
                      {challenge}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">None reported</span>
                )}
              </div>
            </div>

            {currentPerson.otherHealthProblem && (
              <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Other Conditions</span>
                <p className="mt-1 text-xs text-slate-700 sm:text-sm">{currentPerson.otherHealthProblem}</p>
              </div>
            )}

            {currentPerson.remark && (
              <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">General Notes</span>
                <p className="mt-1 text-xs text-slate-700 sm:text-sm">{currentPerson.remark}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Touchpoint Logs</h2>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Track interactions, scheduled syncs, and status updates</p>
            </div>

            <button
              onClick={handleAddFollowUp}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Log Follow-Up
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h3 className="mb-4 text-sm font-bold text-slate-900">
                {editingFollowUp ? "Update Follow-Up Log" : "Log New Touchpoint"}
              </h3>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Scheduled Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Notes & Outcomes
                </label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter conversation notes, updates, or next steps..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none"
                >
                  {editingFollowUp ? "Save Changes" : "Create Entry"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFollowUp(null);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {!currentPerson.followUps || currentPerson.followUps.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">No follow-ups recorded</h3>
              <p className="mt-1 text-xs text-slate-500">
                Start logging your touches with this contact by clicking the button above.
              </p>
            </div>
          ) : (
            <div className="relative space-y-4 pl-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-slate-200">
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
                    <div className="absolute -left-[27px] top-2 h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-600 ring-4 ring-slate-100" />
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-slate-300">
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 sm:text-sm">
                            Log #{followUp.followUpNumber || index + 1}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-medium text-slate-500">
                            {followUp.date ? new Date(followUp.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}
                          </span>
                        </div>

                        <span className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusColor}`}>
                          {followUp.status.charAt(0).toUpperCase() + followUp.status.slice(1)}
                        </span>
                      </div>

                      {followUp.remark && (
                        <p className="mt-2.5 rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 text-xs text-slate-700 sm:text-sm">
                          {followUp.remark}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-slate-100 pt-2.5">
                        <button
                          onClick={() => handleEditFollowUp(followUp)}
                          className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFollowUp(followUp._id)}
                          className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-100 focus:outline-none"
                        >
                          Delete
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