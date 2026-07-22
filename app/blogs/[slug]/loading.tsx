function Shimmer({ className }: { className: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

export default function BlogPostLoading() {
  return (
    <div className="min-h-svh bg-white blogs-page">
      {/* Mobile: stacked layout */}
      <div className="lg:hidden">
        {/* Mobile header skeleton */}
        <div className="bg-brand relative overflow-hidden pattern-bg">
          <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-12">
            <Shimmer className="h-4 w-48 mb-5 bg-white/20" />
            <Shimmer className="h-8 w-3/4 mb-2 bg-white/20" />
            <Shimmer className="h-8 w-1/2 mb-4 bg-white/20" />
            <div className="flex gap-3">
              <Shimmer className="h-4 w-24 bg-white/20" />
              <Shimmer className="h-4 w-32 bg-white/20" />
            </div>
            <div className="flex gap-1.5 mt-3">
              <Shimmer className="h-5 w-16 bg-white/20 rounded-full" />
              <Shimmer className="h-5 w-20 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Mobile cover image skeleton */}
        <div className="relative pattern-bg" data-theme="light">
          <div className="relative z-10">
            <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20 mb-6">
              <Shimmer className="w-full h-64 sm:h-80 rounded-xl" />
            </div>
            <article className="max-w-4xl mx-auto px-4 pb-12">
              <Shimmer className="h-5 w-3/4 mb-6 border-l-4 border-brand pl-4" />
              <Shimmer className="h-3 w-full mb-2" />
              <Shimmer className="h-3 w-full mb-2" />
              <Shimmer className="h-3 w-5/6 mb-2" />
              <Shimmer className="h-3 w-4/6 mb-6" />
              <Shimmer className="h-5 w-48 mb-3" />
              <Shimmer className="h-3 w-full mb-2" />
              <Shimmer className="h-3 w-full mb-2" />
              <Shimmer className="h-3 w-3/4 mb-6" />
              <Shimmer className="h-3 w-full mb-2" />
              <Shimmer className="h-3 w-full mb-2" />
              <Shimmer className="h-3 w-4/5 mb-2" />
              <Shimmer className="h-3 w-5/6" />
            </article>
          </div>
        </div>
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:flex h-screen pt-16">
        {/* Left sidebar skeleton */}
        <aside className="w-2/5 shrink-0 bg-brand relative overflow-hidden pattern-bg">
          <div className="sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none">
            <div className="relative z-10 px-8 xl:px-10 py-12 flex flex-col h-full">
              <Shimmer className="h-4 w-48 mb-6 bg-white/20" />
              <Shimmer className="h-8 w-full mb-2 bg-white/20" />
              <Shimmer className="h-8 w-3/4 mb-5 bg-white/20" />
              <div className="flex gap-3">
                <Shimmer className="h-4 w-24 bg-white/20" />
                <Shimmer className="h-4 w-32 bg-white/20" />
              </div>
              <div className="flex gap-1.5 mt-4">
                <Shimmer className="h-5 w-16 bg-white/20 rounded-full" />
                <Shimmer className="h-5 w-20 bg-white/20 rounded-full" />
              </div>
              <Shimmer className="w-full h-48 mt-8 rounded-xl bg-white/20" />
              <div className="mt-auto pt-8">
                <Shimmer className="h-4 w-24 bg-white/20" />
              </div>
            </div>
          </div>
        </aside>

        {/* Right content skeleton */}
        <div className="flex-1 min-w-0 overflow-y-auto pattern-bg" data-theme="light">
          <div className="relative z-10 max-w-3xl mx-auto px-10 py-12">
            <Shimmer className="h-5 w-3/4 mb-10 border-l-4 border-brand pl-4" />
            <Shimmer className="h-3 w-full mb-2" />
            <Shimmer className="h-3 w-full mb-2" />
            <Shimmer className="h-3 w-5/6 mb-2" />
            <Shimmer className="h-3 w-4/6 mb-6" />
            <Shimmer className="h-5 w-48 mb-3" />
            <Shimmer className="h-3 w-full mb-2" />
            <Shimmer className="h-3 w-full mb-2" />
            <Shimmer className="h-3 w-3/4 mb-6" />
            <Shimmer className="h-3 w-full mb-2" />
            <Shimmer className="h-3 w-full mb-2" />
            <Shimmer className="h-3 w-4/5 mb-2" />
            <Shimmer className="h-3 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
