"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button"; // ensure you have shadcn button installed

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  // Fetch current user on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user?.username) {
          setUsername(data.user.username);
        } else {
          setUsername(null);
        }
      } catch {
        setUsername(null);
      }
    })();
  }, []);

  // Sign out → clear user + redirect
  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      setUsername(null); // reset navbar
      router.push("/"); // redirect to landing page
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md shadow-md text-white">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-violet-400">
          TrueFeedback
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {username ? (
          <>
            <Button
              variant="ghost"
              onClick={() => router.push("/profile")}
              className="text-gray-200 hover:text-black"
            >
              Hi, {username}
            </Button>
            <Button
              onClick={handleSignOut}
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link href="/" className="text-sm hover:underline">
              Home
            </Link>
            <Link href="/signup" className="text-sm hover:underline">
              Sign Up
            </Link>
            <Link href="/signin" className="text-sm hover:underline">
              Sign In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
