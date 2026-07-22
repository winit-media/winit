"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";
import { Section, Field } from "../components/FormElements";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

export default function BlogUsersTab() {
  const { data, updateContent, revertedCount } = useAdmin();
  const [users, setUsers] = useState(data.blogUsers);
  const [prevReverted, setPrevReverted] = useState(revertedCount);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const { toast } = useToast();

  if (revertedCount !== prevReverted) {
    setPrevReverted(revertedCount);
    setUsers(data.blogUsers);
  }

  const add = () => {
    if (!newEmail.trim()) {
      toast("Email is required", "error");
      return;
    }
    if (!newEmail.includes("@")) {
      toast("Please enter a valid email address", "error");
      return;
    }
    const updated = [...users, { email: newEmail.trim(), displayName: newName.trim() || newEmail.trim() }];
    setUsers(updated);
    updateContent({ blogUsers: updated });
    setNewEmail("");
    setNewName("");
    toast("Blog user added", "success");
  };

  const remove = (i: number) => {
    const updated = users.filter((_, j) => j !== i);
    setUsers(updated);
    updateContent({ blogUsers: updated });
    toast("Blog user removed", "success");
    setDeleteIdx(null);
  };

  return (
    <div className="space-y-6">
      <Section title="Add Blog User">
        <p className="text-sm text-gray-500">
          Users in this list can sign in on the blog subdomain to manage posts. Anyone not listed here is blocked from the blog manager.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Email" value={newEmail} onChange={setNewEmail} placeholder="user@example.com" />
          <Field label="Display Name" value={newName} onChange={setNewName} placeholder="John Doe" />
        </div>
        <button
          onClick={add}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
        >
          <Plus size={14} /> Add User
        </button>
      </Section>

      <Section title={`Blog Users (${users.length})`}>
        {users.length === 0 ? (
          <p className="text-gray-400 text-sm">No blog users added yet</p>
        ) : (
          <div className="space-y-2">
            {users.map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{u.displayName}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <button
                  onClick={() => setDeleteIdx(i)}
                  className="text-red-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      <ConfirmDialog
        open={deleteIdx !== null}
        title="Remove Blog User"
        message={`Are you sure you want to remove "${deleteIdx !== null ? users[deleteIdx]?.displayName || users[deleteIdx]?.email : ""}"? They will lose access to the blog manager.`}
        onConfirm={() => deleteIdx !== null && remove(deleteIdx)}
        onCancel={() => setDeleteIdx(null)}
      />
    </div>
  );
}
