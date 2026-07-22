"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <AdminProvider>
      <Navbar />
      <main className="min-h-svh bg-white flex flex-col items-center justify-center relative overflow-hidden pattern-bg" data-theme="light">
        <div className="relative z-10 text-center px-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-3">
            Something Went Wrong
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto mb-4">
            An unexpected error occurred. Please try again.
          </p>
          {error.message && (
            <p className="text-gray-400 text-xs font-mono bg-gray-50 rounded-lg px-4 py-2 mb-8 max-w-md mx-auto break-all">
              {error.message}
            </p>
          )}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="bg-brand text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-brand-dark transition-colors shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="text-gray-500 hover:text-brand font-medium text-sm transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </AdminProvider>
  );
}
