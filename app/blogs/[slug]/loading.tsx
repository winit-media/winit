function Shimmer({ className }: { className: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

export default function BlogPostLoading() {
  return (
    <div className="min-h-dvh bg-white">
      {/* Header skeleton */}
      <div className="bg-brand relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
          <Shimmer className="h-8 w-3/4 mb-3 bg-white/20" />
          <Shimmer className="h-8 w-1/2 mb-6 bg-white/20" />
          <div className="flex gap-3">
            <Shimmer className="h-4 w-24 bg-white/20" />
            <Shimmer className="h-4 w-32 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Cover image skeleton */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20 mb-8">
        <Shimmer className="w-full h-64 sm:h-80 rounded-xl" />
      </div>

      {/* Content skeleton */}
      <article className="max-w-4xl mx-auto px-4 pb-20">
        <Shimmer className="h-4 w-full mb-2" />
        <Shimmer className="h-4 w-5/6 mb-2" />
        <Shimmer className="h-4 w-4/6 mb-8" />
        <Shimmer className="h-3 w-full mb-2" />
        <Shimmer className="h-3 w-full mb-2" />
        <Shimmer className="h-3 w-3/4 mb-2" />
        <Shimmer className="h-3 w-5/6 mb-6" />
        <Shimmer className="h-5 w-48 mb-3" />
        <Shimmer className="h-3 w-full mb-2" />
        <Shimmer className="h-3 w-full mb-2" />
        <Shimmer className="h-3 w-2/3 mb-6" />
        <Shimmer className="h-3 w-full mb-2" />
        <Shimmer className="h-3 w-full mb-2" />
        <Shimmer className="h-3 w-4/5 mb-2" />
        <Shimmer className="h-3 w-5/6" />
      </article>
    </div>
  );
}
