// src/app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

const bodySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectDb();
  const { email, code } = parsed.data;

  const record = await Otp.findOne({ email, code }).exec();
  if (!record) return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  if (record.expiresAt < new Date()) {
    await record.deleteOne();
    return NextResponse.json({ error: "Code expired" }, { status: 400 });
  }

  // mark user verified
  await User.findOneAndUpdate({ email }, { verified: true }).exec();
  await record.deleteOne();

  return NextResponse.json({ ok: true });
}
