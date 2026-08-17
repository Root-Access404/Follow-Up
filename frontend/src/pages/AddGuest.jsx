import PersonForm from "../components/PersonForm";

function AddGuest({ onBack, onPersonCreated }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={onBack}
        className="group mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
      >
        <svg className="h-4 w-4 transition group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Add New Guest</h1>
          <p className="mt-1 text-sm text-slate-500">Fill in the contact information and follow-up details.</p>
        </div>
        <PersonForm onPersonCreated={onPersonCreated} />
      </div>
    </div>
  );
}

export default AddGuest;