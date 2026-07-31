"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, LogOut, Mail, Phone, Trash2, ExternalLink } from "lucide-react";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { app, fetchSiteContent, fetchLeads, markLeadRead, deleteLead, Lead, SUPER_ADMIN_EMAIL } from "@/lib/firebase";
import { ToastProvider, useToast } from "@/components/ui/Toast";

const auth = getAuth(app);

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Leads</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Sign in to view incoming leads</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchLeads();
    setLeads(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    await deleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast("Lead deleted", "success");
  };

  const handleMarkRead = async (id: string, read: boolean) => {
    await markLeadRead(id, read);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, read } : l)));
  };

  const unreadCount = leads.filter((l) => !l.read).length;

  return (
    <div className="min-h-svh bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Leads</h1>
            <p className="text-xs text-gray-400">{leads.length} total{unreadCount > 0 && `, ${unreadCount} unread`}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => signOut(auth)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-brand" />
          </div>
        ) : leads.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No leads yet.</p>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
                !lead.read ? "ring-2 ring-brand/20" : ""
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-base">{lead.name}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    {!lead.read && (
                      <span className="w-2 h-2 rounded-full bg-brand" title="Unread" />
                    )}
                    <button
                      onClick={() => handleDelete(lead.id!)}
                      className="text-gray-300 hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-3 text-sm">
                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex items-center gap-1.5 text-brand hover:text-brand-dark transition-colors"
                  >
                    <Mail size={14} /> {lead.email}
                  </a>
                  {lead.phone && (
                    <a
                      href={`tel:${lead.phone}`}
                      className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Phone size={14} /> {lead.phone}
                    </a>
                  )}
                </div>

                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{lead.message}</p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400">
                    {new Date(lead.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={() => handleMarkRead(lead.id!, !lead.read)}
                    className={`text-xs font-medium transition-colors ${
                      lead.read ? "text-gray-400 hover:text-gray-600" : "text-brand hover:text-brand-dark"
                    }`}
                  >
                    {lead.read ? "Mark unread" : "Mark read"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthed(!!user);
      if (user?.email) {
        try {
          const content = await fetchSiteContent();
          const allowed =
            content.blogUsers.some((u) => u.email === user.email) ||
            user.email === SUPER_ADMIN_EMAIL;
          setAuthorized(allowed);
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
        <LoginForm onLogin={() => setAuthed(true)} />
      </ToastProvider>
    );
  }

  if (!authorized) {
    return (
      <ToastProvider>
        <div className="min-h-svh bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-500 text-sm mb-6">Your account is not authorized to view leads.</p>
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
      <LeadsDashboard />
    </ToastProvider>
  );
}
