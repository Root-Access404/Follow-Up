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
    const createdAtText = person.createdAt
      ? new Date(person.createdAt).toLocaleString().toLowerCase()
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Guest Follow-Up List</h1>
          <p className="mt-1 text-sm text-slate-500">{filteredPeople.length} guest{filteredPeople.length === 1 ? "" : "s"} found</p>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <button
            onClick={onExportExcel}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-emerald-700 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          >
            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>

          <button
            onClick={onAddNewGuest}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Guest
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, contact, date, location or invited by..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
        />
      </div>

      {filteredPeople.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-900">No guests found</h2>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your search criteria or add a new guest to the list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person) => (
            <div
              key={person._id}
              className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-bold text-slate-900">{person.name}</h2>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    {person.status || "known"}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-medium text-slate-700">{person.contactNo}</span>
                  </div>

                  {person.location && (
                    <div className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{person.location}</span>
                    </div>
                  )}

                  {person.invitedBy && (
                    <div className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Invited by <strong className="font-semibold text-slate-700">{person.invitedBy}</strong></span>
                    </div>
                  )}

                  {person.createdAt && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Added {formatDateDisplay(person.createdAt)}</span>
                    </div>
                  )}
                </div>

                {person.healthChallenges?.length > 0 && (
                  <div className="border-t border-slate-100 pt-2.5">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Health Challenges</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {person.healthChallenges.map((challenge) => (
                        <span
                          key={challenge}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                        >
                          {challenge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3.5">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Follow-ups</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700">
                    {person.followUps?.length || 0}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewDetails(person)}
                    className="flex-1 rounded-lg bg-indigo-600 py-1.5 px-3 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(person)}
                    className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(person._id)}
                    className="rounded-lg border border-rose-200 bg-rose-50 py-1.5 px-3 text-xs font-medium text-rose-700 transition hover:bg-rose-100 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GuestList;