"use client";
import React, { useEffect, useState } from "react";

type Feedback = { _id: string; text: string; createdAt: string };

export default function FeedbackList() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      setItems(data.items || []);
      setLoading(false);
    })();
  }, []);

  const askDelete = (id: string) => {
    setConfirmId(id);
  };

  const cancelDelete = () => setConfirmId(null);

  const doDelete = async (id: string) => {
    const res = await fetch("/api/feedback", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (res.ok) {
      setItems((p) => p.filter((it) => it._id !== id));
      setConfirmId(null);
    } else {
      alert(data.error || "Failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {items.length === 0 ? <p className="text-sm text-gray-300">No feedback yet</p> : null}
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it._id} className="p-3 bg-white/5 rounded flex items-start justify-between">
            <div>
              <div className="text-sm">{it.text}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(it.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {confirmId === it._id ? (
                <>
                  <div className="text-sm text-red-300">Confirm delete?</div>
                  <div className="flex gap-2">
                    <button onClick={() => doDelete(it._id)} className="px-3 py-1 bg-red-600 rounded">Yes</button>
                    <button onClick={cancelDelete} className="px-3 py-1 bg-gray-600 rounded">No</button>
                  </div>
                </>
              ) : (
                <button onClick={() => askDelete(it._id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
