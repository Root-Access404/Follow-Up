import PersonForm from "../components/PersonForm";

function AddGuest({ onBack, onPersonCreated }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased pb-12">
      {/* Top Header Bar for consistent mobile/desktop navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
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
            <span>Back to Dashboard</span>
          </button>

          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold tracking-wider text-indigo-700 uppercase ring-1 ring-inset ring-indigo-600/15 sm:text-xs">
            New Entry
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Add New Guest
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Fill in the contact information and follow-up details.
          </p>
        </div>

        {/* Embedded Form Component */}
        <PersonForm onPersonCreated={onPersonCreated} />
      </main>
    </div>
  );
}

export default AddGuest;