/**
 * Route-level loading state — skeleton shells while a page's
 * server components stream in.
 */
export default function Loading() {
  return (
    <div className="section-shell pb-24 pt-28" aria-busy="true" aria-label="Loading page">
      <div className="skeleton h-4 w-24 rounded-md" />
      <div className="skeleton mt-4 h-10 w-2/3 max-w-md rounded-xl" />
      <div className="skeleton mt-3 h-4 w-1/2 max-w-sm rounded-md" />
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
