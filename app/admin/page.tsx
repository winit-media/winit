"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AdminProvider } from "@/components/AdminProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { app } from "@/lib/firebase";
import LoginGate from "./components/LoginGate";
import AdminDashboard from "./components/AdminDashboard";

const auth = getAuth(app);

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthed(!!user);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center">
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

  return (
    <ToastProvider>
      <AdminProvider>
        <AdminDashboard />
      </AdminProvider>
    </ToastProvider>
  );
}
