import nodemailer from "nodemailer";
const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.EMAIL_FROM || "no-reply@truefeedback.local";

if (!host || !user || !pass) {
  // We'll still allow app to run, but sending will error at runtime if not set
  console.warn("Mailer env vars not fully set. Emails will fail.");
}

export const transporter = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass,
  },
});

export async function sendOtpEmail(to: string, code: string) {
  await transporter.sendMail({
    from,
    to,
    subject: "Your TrueFeedback verification code",
    html: `<p>Your TrueFeedback verification code is <strong>${code}</strong>. This code expires in 30 minutes.</p>`,
  });
}
