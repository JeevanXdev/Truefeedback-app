"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center h-[calc(100vh-64px)] px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-3xl text-center bg-white/10 p-12 rounded-3xl shadow-2xl backdrop-blur-md border border-white/20">
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
            TrueFeedback
          </h1>
          <p className="text-gray-200 text-lg mb-8">
            Collect anonymous feedback easily — share your personal link and receive honest messages.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/signup"
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Get Started
            </Link>
            <Link
              href="/signin"
              className="border border-white/30 px-8 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
            >
              Already have an account? Let's sign in
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
