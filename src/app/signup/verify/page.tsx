"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Verification failed");
      } else {
        // success → redirect to signin
        router.push("/signin");
      }
    } catch (err) {
      console.error("Verify request failed:", err);
      setMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <nav className="px-6 py-4 bg-violet-700">
        <div className="text-white font-bold text-lg">TrueFeedback</div>
      </nav>

      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-gradient-to-br from-gray-900 to-violet-800">
        <div className="w-full max-w-md bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-2 text-white">Verify your email</h2>
          <p className="text-sm text-gray-300 mb-4">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="p-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 tracking-widest text-center"
              required
            />
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 transition px-4 py-2 rounded text-white font-semibold"
            >
              Verify
            </button>
            {msg && <div className="text-red-300 mt-2">{msg}</div>}
          </form>
        </div>
      </main>
    </>
  );
}
