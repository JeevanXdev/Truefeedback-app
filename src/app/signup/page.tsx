"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Signup failed");
      } else {
        // Redirect to OTP verification page
        router.push(`/signup/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      console.error(err);
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
          <h2 className="text-xl font-semibold mb-4 text-white">Create account</h2>
          <form onSubmit={handle} className="flex flex-col gap-3">
            <input
              type="email"
              className="p-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="p-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Username (optional)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="p-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-2 bg-violet-600 hover:bg-violet-700 transition px-4 py-2 rounded text-white font-semibold"
            >
              Sign up
            </button>
            {msg && <div className="text-red-300 mt-2">{msg}</div>}
          </form>
        </div>
      </main>
    </>
  );
}
