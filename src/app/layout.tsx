// src/app/layout.tsx
import "./globals.css";
import React from "react";

export const metadata = {
  title: "TrueFeedback",
  description: "Anonymous feedback for everyone"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-violet-800 via-violet-900 to-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}
