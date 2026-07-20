"use client";

import Link from "next/link";
import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function NotFound() {
  return (
    <AdminProvider>
      <Navbar />
      <main className="min-h-svh bg-white flex flex-col items-center justify-center relative overflow-hidden pattern-bg" data-theme="light">
        <div className="relative z-10 text-center px-4">
          <p className="text-brand font-display font-bold text-[8rem] sm:text-[10rem] leading-none select-none mb-0">
            404
          </p>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 -mt-4 mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block bg-brand text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-brand-dark transition-colors shadow-lg hover:shadow-xl"
          >
            Go Back Home
          </Link>
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </AdminProvider>
  );
}
