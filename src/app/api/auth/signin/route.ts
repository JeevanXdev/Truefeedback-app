// src/app/api/auth/signin/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectDb();
  const { email, password } = parsed.data;
  const user = await User.findOne({ email }).exec();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!user.verified) return NextResponse.json({ error: "Email not verified" }, { status: 403 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signToken({ id: user._id, email: user.email, username: user.username });
  const res = NextResponse.json({ ok: true, username: user.username });
  // cookie set
  res.cookies.set({
    name: "tf_token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
