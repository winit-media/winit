function Shimmer({ className }: { className: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

export default function BlogsLoading() {
  return (
    <div className="min-h-svh bg-white blogs-page">
      {/* Header skeleton */}
      <div className="bg-brand relative overflow-hidden pattern-bg">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-24 pb-12">
          <Shimmer className="h-10 w-32 mb-3 bg-white/20" />
          <Shimmer className="h-4 w-64 bg-white/20" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="relative w-full py-12 pattern-bg" data-theme="light">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col"
              >
                <Shimmer className="h-48 w-full rounded-none" />
                <div className="p-5 flex flex-col gap-3">
                  <Shimmer className="h-3 w-28" />
                  <Shimmer className="h-5 w-full" />
                  <Shimmer className="h-5 w-3/4" />
                  <Shimmer className="h-3 w-full" />
                  <Shimmer className="h-3 w-5/6" />
                  <div className="flex gap-1.5 mt-1">
                    <Shimmer className="h-5 w-14 rounded-full" />
                    <Shimmer className="h-5 w-16 rounded-full" />
                  </div>
                  <Shimmer className="h-3 w-20 mt-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
