"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FeedbackList from "@/components/FeedbackList";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CheckCircle2, XCircle } from "lucide-react";

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [linkMsg, setLinkMsg] = useState<"copied" | "error" | "">("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.user) {
        router.push("/signin");
        return;
      }
      setUsername(data.user.username);
    })();
  }, [router]);

  const copyLink = async () => {
    if (!username) return;
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_APP_URL}/f/${username}`
      );
      setLinkMsg("copied");
      setTimeout(() => setLinkMsg(""), 2000);
    } catch {
      setLinkMsg("error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="p-6 min-h-[calc(100vh-64px)] bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gray-800/70 border-gray-700 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-white">
                Your Profile
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={copyLink}
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link
                </Button>
                {linkMsg === "copied" && (
                  <span className="flex items-center text-sm text-green-400">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Copied!
                  </span>
                )}
                {linkMsg === "error" && (
                  <span className="flex items-center text-sm text-red-400">
                    <XCircle className="w-4 h-4 mr-1" /> Error
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="text-gray-100">
              <FeedbackList />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
