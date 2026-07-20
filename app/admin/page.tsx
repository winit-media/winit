"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { AdminProvider } from "@/components/AdminProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { app, fetchSiteContent } from "@/lib/firebase";
import { SiteContent } from "@/components/AdminProvider";
import LoginGate from "./components/LoginGate";
import AdminDashboard from "./components/AdminDashboard";

const auth = getAuth(app);

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthed(!!user);
      if (user?.email) {
        setUserEmail(user.email);
        try {
          const content = await fetchSiteContent();
          setSiteContent(content);
          // Only the configured site admin (contactEmail) may manage the
          // full site. Blog editors are restricted to the blog subdomain
          // (/admin/blogs) and are blocked from the main dashboard.
          setAuthorized(user.email === content.contactEmail);
        } catch {
          setAuthorized(false);
        }
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-svh bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (!authed) {
    return (
      <ToastProvider>
        <LoginGate onLogin={() => setAuthed(true)} />
      </ToastProvider>
    );
  }

  if (!authorized) {
    return (
      <ToastProvider>
        <div className="min-h-svh bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-500 text-sm mb-2">
              Your account ({userEmail}) is not authorized to manage the main site.
            </p>
            <p className="text-gray-400 text-xs mb-6">
              If you are a blog editor, use the blog subdomain to manage posts.
            </p>
            <button
              onClick={() => signOut(auth)}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <AdminProvider initialContent={siteContent ?? undefined}>
        <AdminDashboard />
      </AdminProvider>
    </ToastProvider>
  );
}
