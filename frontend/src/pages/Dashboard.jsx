function Dashboard({
  people = [],
  onAddNewGuest,
  onOpenList,
  onLogout,
  currentView = "dashboard",
}) {
  const totalFollowUps = people.reduce(
    (total, person) => total + (person.followUps?.length || 0),
    0
  );

  const pendingFollowUps = people.reduce(
    (total, person) =>
      total +
      (person.followUps?.filter((followUp) => followUp.status !== "completed")
        .length || 0),
    0
  );

  const completedFollowUps = totalFollowUps - pendingFollowUps;
  const completionRate =
    totalFollowUps > 0
      ? Math.round((completedFollowUps / totalFollowUps) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased pb-12">
      {/* Sticky Header with Blue & Green Buttons */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          
          {/* Logo / Header Title */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-xs">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-base font-bold text-slate-900">Follow Up Manager</span>
              <span className="text-[10px] sm:text-xs text-slate-500 truncate">Dashboard</span>
            </div>
          </div>

          {/* Navbar Buttons: Primary Blue Scheme */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* BLUE Dashboard Button */}
            <button
              type="button"
              className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-white shadow-xs transition-all duration-150 active:scale-95 sm:h-10 sm:px-4 sm:text-sm ${
                currentView === "dashboard"
                  ? "bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-500/30"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              aria-label="Dashboard"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            {/* BLUE Follow-Up List Button */}
            <button
              type="button"
              onClick={onOpenList}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-95 sm:h-10 sm:px-4 sm:text-sm"
              aria-label="Follow-Up List"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="hidden sm:inline">Tasks</span>
            </button>

            {/* BLUE Logout Button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-95 sm:h-10 sm:px-4 sm:text-sm"
                aria-label="Logout"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Exit</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Guests</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-600/20 sm:h-10 sm:w-10 sm:rounded-xl">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{people.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Tasks</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/20 sm:h-10 sm:w-10 sm:rounded-xl">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{totalFollowUps}</p>
          </div>

          <div className="col-span-1 xs:col-span-2 sm:col-span-1 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs sm:p-4 sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-600/20 sm:h-10 sm:w-10 sm:rounded-xl">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{pendingFollowUps}</p>
          </div>
        </div>

        {/* Enhanced Follow-Up Manager Section */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs sm:rounded-2xl">
          {/* Manager Header */}
          <div className="flex flex-col gap-2 xs:gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-blue-50/50 p-3 xs:p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2.5 xs:gap-3 min-w-0">
              <div className="flex h-9 xs:h-10 w-9 xs:w-10 shrink-0 items-center justify-center rounded-lg xs:rounded-xl bg-blue-600 text-white shadow-xs">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm xs:text-base font-bold text-slate-900 truncate">Tasks Overview</h2>
                <p className="text-[10px] xs:text-xs text-slate-500 truncate">Distribution & progress</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenList}
              className="inline-flex w-full xs:w-auto items-center justify-center gap-1.5 rounded-lg xs:rounded-xl bg-blue-600 px-3 xs:px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95 shrink-0"
            >
              <span className="truncate">Manage</span>
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Progress & Stat Breakdown */}
          <div className="p-3 xs:p-4 sm:p-6 space-y-3 xs:space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                <span>Task Health & Completion</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3 sm:rounded-xl">
                <p className="text-[10px] sm:text-[11px] font-medium text-blue-700">Completed</p>
                <p className="mt-1 text-lg sm:text-xl font-bold text-blue-600">{completedFollowUps}</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 sm:rounded-xl">
                <p className="text-[10px] sm:text-[11px] font-medium text-amber-700">Pending</p>
                <p className="mt-1 text-lg sm:text-xl font-bold text-amber-600">{pendingFollowUps}</p>
              </div>
              <div className="col-span-1 xs:col-span-2 sm:col-span-1 rounded-lg border border-purple-200 bg-purple-50/60 p-3 sm:rounded-xl">
                <p className="text-[10px] sm:text-[11px] font-medium text-purple-700">Active Contacts</p>
                <p className="mt-1 text-lg sm:text-xl font-bold text-purple-600">{people.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons (Solid Blue) */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 xs:gap-3 sm:gap-4">
          {/* Blue Add Guest Card */}
          <button
            type="button"
            onClick={onAddNewGuest}
            className="group flex flex-col xs:flex-row xs:items-center xs:justify-between rounded-xl xs:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-3.5 xs:p-4 sm:p-6 text-left text-white shadow-sm xs:shadow-xs transition-all duration-150 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] sm:flex-col sm:justify-between\"
          >
            <div className="flex items-center gap-2.5 xs:gap-3 sm:block">
              <div className="flex h-9 xs:h-10 w-9 xs:w-10 shrink-0 items-center justify-center rounded-lg xs:rounded-xl bg-white/20 ring-1 ring-white/30 sm:h-11 sm:w-11">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm xs:text-base font-bold sm:mt-3 sm:text-lg truncate">Add Guest</h2>
                <p className="hidden text-xs text-blue-100 sm:mt-1 sm:block sm:text-sm">
                  Register new contact.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold sm:mt-5 ml-11 xs:ml-0">
              <span>Create</span>
              <svg className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Blue Follow-Up List Action Card */}
          <button
            type="button"
            onClick={onOpenList}
            className="group flex flex-col xs:flex-row xs:items-center xs:justify-between rounded-xl xs:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-3.5 xs:p-4 sm:p-6 text-left text-white shadow-sm xs:shadow-xs transition-all duration-150 hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] sm:flex-col sm:justify-between\"
          >
            <div className="flex items-center gap-2.5 xs:gap-3 sm:block">
              <div className="flex h-9 xs:h-10 w-9 xs:w-10 shrink-0 items-center justify-center rounded-lg xs:rounded-xl bg-white/20 ring-1 ring-white/30 sm:h-11 sm:w-11">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm xs:text-base font-bold sm:mt-3 sm:text-lg truncate">Tasks List</h2>
                <p className="hidden text-xs text-blue-100 sm:mt-1 sm:block sm:text-sm">
                  View & manage all.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold sm:mt-5 ml-11 xs:ml-0">
              <span>View</span>
              <svg className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;