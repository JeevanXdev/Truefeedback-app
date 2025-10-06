
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("tf_token")?.value;
  if (!token) return NextResponse.json({ user: null });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ user: null });

  await connectDb();
  const user = await User.findById(payload.id).select("email username").lean().exec();
  return NextResponse.json({ user });
}