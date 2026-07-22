"use client";

export default function BlogsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 text-sm mb-6">
          An error occurred while loading the blog. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-brand text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
