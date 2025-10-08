import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { sendOtpEmail } from "@/lib/mailer";
import { genUsername } from "@/utils/genUsername";


const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  username: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDb();
    const { email, password, username } = parsed.data;

    // check if user already exists
    const existing = await User.findOne({ email }).exec();
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // ensure unique username
    let uname = username ? username.trim().toLowerCase() : genUsername("user");
    const taken = await User.findOne({ username: uname }).exec();
    if (taken) {
      uname = genUsername(uname); 
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      email,
      username: uname,
      passwordHash,
      verified: false,
    });

    // generate OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min expiry
    await Otp.create({ email, code, expiresAt });

    // send OTP email
    try {
      await sendOtpEmail(email, code);
    } catch (err) {
      console.error("send mail failed", err);
      
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
