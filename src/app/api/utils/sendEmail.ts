import nodemailer from "nodemailer";
import { getEnv } from "@/lib/env";

const transporter = nodemailer.createTransport({
  host: getEnv("SMTP_HOST"),
  port: Number(getEnv("SMTP_PORT")),
  auth: {
    user: getEnv("SMTP_USER"),
    pass: getEnv("SMTP_PASS"),
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: getEnv("EMAIL_FROM"),
    to,
    subject,
    html,
  });
}