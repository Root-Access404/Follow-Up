function GuestList({
  people = [],
  searchTerm = "",
  onSearchChange,
  onExportExcel,
  onAddNewGuest,
  onViewDetails,
  onEdit,
  onDelete,
  formatDateDisplay,
}) {
  const filteredPeople = people.filter((person) => {
    const search = searchTerm.toLowerCase();
    const entryDate = person.entryDate || person.createdAt;
    const createdAtText = entryDate
      ? new Date(entryDate).toLocaleString().toLowerCase()
      : "";
    return (
      person.name?.toLowerCase().includes(search) ||
      person.contactNo?.includes(search) ||
      person.location?.toLowerCase().includes(search) ||
      person.invitedBy?.toLowerCase().includes(search) ||
      createdAtText.includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased pb-16">
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Top Header & Standard Action Buttons */}
        <div className="mb-5 flex flex-col gap-3 xs:gap-4">
          <div>
            <h1 className="text-lg xs:text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              All Guests
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {filteredPeople.length} guest{filteredPeople.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="flex flex-col gap-2 xs:gap-3 sm:flex-row sm:items-center\">   <button
              type="button"
              onClick={onExportExcel}
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:text-sm"
            >
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Export Excel</span>
            </button>

            {/* Primary Blue Add Button */}
            <button
              type="button"
              onClick={onAddNewGuest}
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:text-sm"
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
              <span>Add New Guest</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, contact, date, location, or invited by..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition duration-150 focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 focus:outline-none"
          />
        </div>

        {/* Empty State */}
        {filteredPeople.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-base font-bold text-slate-900">No guests found</h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Try adjusting your search criteria or add a new guest to the list.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {filteredPeople.map((person) => (
              <div
                key={person._id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4.5 sm:p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-sm font-bold text-purple-700 ring-1 ring-purple-500/20">
                      {person.name ? person.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                        {person.name || "Unnamed"}
                      </h2>
                      <span className="mt-0.5 inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        {person.status || "known"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5 truncate">
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <span className="truncate font-medium text-slate-700">
                        {person.contactNo || "No contact"}
                      </span>
                    </div>

                    {person.location && (
                      <div className="flex items-center gap-2.5 truncate">
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
                        <span className="truncate">{person.location}</span>
                      </div>
                    )}

                    {person.invitedBy && (
                      <div className="flex items-center gap-2.5 truncate">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <span className="truncate">
                          Invited by{" "}
                          <strong className="font-semibold text-slate-800">
                            {person.invitedBy}
                          </strong>
                        </span>
                      </div>
                    )}

                    {(person.entryDate || person.createdAt) && (
                      <div className="flex items-center gap-2.5 truncate text-slate-400">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="truncate">
                          Date {formatDateDisplay(person.entryDate || person.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {person.healthChallenges?.length > 0 && (
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Health Challenges
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {person.healthChallenges.map((challenge) => (
                          <span
                            key={challenge}
                            className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700 ring-1 ring-inset ring-purple-600/15"
                          >
                            {challenge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer and Colored Action Buttons with Word Spacing */}
                <div className="mt-5 border-t border-slate-100 pt-3.5">
                  <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                    <span className="[word-spacing:0.08em]">Follow-ups</span>
                    <span className="inline-flex items-center rounded-md bg-purple-600 px-2 py-0.5 font-semibold text-white-700 ring-1 ring-inset ring-purple-600/10">
                      {person.followUps?.length || 0}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Purple Solid Primary Button */}
                    <button
                      type="button"
                      onClick={() => onViewDetails(person)}
                      className="inline-flex h-8 items-center justify-center rounded-lg bg-purple-600 px-2.5 text-xs font-semibold [word-spacing:0.12em] text-white shadow-xs shadow-purple-200 transition-all duration-150 hover:bg-purple-700 active:scale-[0.98] focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      View
                    </button>

                    {/* Green Soft Tone Button */}
                    <button
                      type="button"
                      onClick={() => onEdit(person)}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 text-xs font-semibold [word-spacing:0.12em] text-emerald-700 shadow-xs transition-all duration-150 hover:bg-emerald-100 active:scale-[0.98] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      Edit
                    </button>

                    {/* Purple Soft Tone Button */}
                    <button
                      type="button"
                      onClick={() => onDelete(person._id)}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-purple-200 bg-purple-50 px-2.5 text-xs font-semibold [word-spacing:0.12em] text-purple-700 shadow-xs transition-all duration-150 hover:bg-purple-100 active:scale-[0.98] focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default GuestList;