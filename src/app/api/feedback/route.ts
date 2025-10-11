// src/app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import Feedback from "@/models/Feedback";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

/**
 * GET -> list feedbacks for current user (requires cookie)
 * POST -> create a feedback for username (public)
 * DELETE -> remove feedback by id (requires cookie & owner)
 */

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const username = url.searchParams.get("username");
  await connectDb();
  if (username) {
    const items = await Feedback.find({ ownerUsername: username }).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({ items });
  } else {
    // current user
    const token = req.cookies.get("tf_token")?.value;
    const payload = verifyToken(token || "");
    if (!payload) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const items = await Feedback.find({ ownerUsername: payload.username }).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({ items });
  }
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const bodySchema = z.object({
    ownerUsername: z.string().min(1),
    text: z.string().min(1),
  });
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectDb();
  const { ownerUsername, text } = parsed.data;
  await Feedback.create({ ownerUsername, text });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const json = await req.json();
  const bodySchema = z.object({ id: z.string().min(1) });
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const token = req.cookies.get("tf_token")?.value;
  const payload = verifyToken(token || "");
  if (!payload) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  await connectDb();
  const fb = await Feedback.findById(parsed.data.id).exec();
  if (!fb) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (fb.ownerUsername !== payload.username) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

  await fb.deleteOne();
  return NextResponse.json({ ok: true });
}