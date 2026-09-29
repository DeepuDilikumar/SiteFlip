export default function ResultsLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Searching for businesses…</span>
      <div className="skeleton h-12 w-full rounded-xl" />
      <div className="skeleton mt-10 h-9 w-64" />
      <div className="skeleton mt-4 h-4 w-48" />
      <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-card">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <div className="skeleton h-4" style={{ width: `${40 + ((i * 17) % 30)}%` }} />
              <div className="skeleton mt-2 h-3 w-40" />
            </div>
            <div className="skeleton h-6 w-36 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
