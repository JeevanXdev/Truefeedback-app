"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Failed");
    else {
      router.push("/profile");
    }
  };

  return (
    <>
      <nav className="px-6 py-4">
        <div className="text-white font-bold">TrueFeedback</div>
      </nav>
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="w-full max-w-md bg-white/5 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Sign in</h2>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="p-2 rounded bg-white/5" />
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="p-2 rounded bg-white/5" />
            <button className="bg-violet-600 px-4 py-2 rounded">Sign in</button>
            {msg && <div className="text-red-300">{msg}</div>}
          </form>
        </div>
      </main>
    </>
  );
}
