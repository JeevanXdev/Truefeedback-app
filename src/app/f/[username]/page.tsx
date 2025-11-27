"use client";

import React, { useState, use } from "react";

export default function PublicFeedback({ params }: { params: Promise<{ username: string }> }) {
  // unwrap params safely
  const { username } = use(params);

  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  // new states for AI suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ ownerUsername: username, text }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Failed");
    else {
      setOk(true);
      setText("");
    }
  };

  // fetch suggestions from AI API
  const getSuggestions = async () => {
    setLoading(true);
    setError("");
    setSuggestions([]);
    try {
      const res = await fetch("/api/suggest-messages", {
        method: "POST",
        body: JSON.stringify({ username }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to get suggestions");
      } else {
        setSuggestions(data.suggestions || []);
      }
    } catch (err) {
      setError("Something went wrong while fetching suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="w-full max-w-xl bg-white/5 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-3">
          Leave anonymous feedback for <span className="font-bold">@{username}</span>
        </h2>

        {ok && <div className="mb-3 text-green-300">✅ Thanks — your feedback has been submitted.</div>}

        <form onSubmit={submit} className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full p-3 rounded bg-white/5 focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Write your feedback..."
          ></textarea>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 transition px-4 py-2 rounded font-semibold"
            >
              Send
            </button>

            <button
              type="button"
              onClick={getSuggestions}
              className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded font-semibold"
              disabled={loading}
            >
              {loading ? "Loading..." : "Suggest Messages"}
            </button>
          </div>
        </form>

        {msg && <div className="text-red-300 mt-2">{msg}</div>}
        {error && <div className="text-red-300 mt-2">{error}</div>}

        {/* Suggestions list */}
        {suggestions.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Suggestions:</h3>
            <ul className="space-y-2">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => setText(s)}
                  className="cursor-pointer bg-white/10 hover:bg-white/20 p-2 rounded transition"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
