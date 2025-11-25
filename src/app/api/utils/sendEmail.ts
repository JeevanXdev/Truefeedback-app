import nodemailer, { Transporter } from "nodemailer";
import { getEnv } from "@/lib/env";

// Load config once
const smtpHost = getEnv("SMTP_HOST");
const smtpPort = Number(getEnv("SMTP_PORT"));
const smtpUser = getEnv("SMTP_USER");
const smtpPass = getEnv("SMTP_PASS");
const emailFrom = getEnv("EMAIL_FROM");

// Create reusable transporter
const transporter: Transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // auto-detect secure mode
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// Optional: verify connection once on startup
transporter.verify().catch((err) => {
  console.error("❌ SMTP connection failed:", err);
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: emailFrom,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw new Error("Email sending failed");
  }
}
