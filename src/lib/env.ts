export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];

  if (!value) {
    if (fallback !== undefined) return fallback;
    throw new Error(`❌ Missing environment variable: ${key}`);
  }

  return value;
}


export const MONGODB_URI = getEnv("MONGODB_URI");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const NEXT_PUBLIC_APP_URL = getEnv("NEXT_PUBLIC_APP_URL");

// For email mailtrap 
export const SMTP_HOST = getEnv("SMTP_HOST");
export const SMTP_PORT = getEnv("SMTP_PORT");
export const SMTP_USER = getEnv("SMTP_USER");
export const SMTP_PASS = getEnv("SMTP_PASS");
export const EMAIL_FROM = getEnv("EMAIL_FROM");
