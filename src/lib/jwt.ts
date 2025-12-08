import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { getEnv } from "./env";

const SECRET: Secret = getEnv("JWT_SECRET");

export function signToken(
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "7d" // Explicit union type
) {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, SECRET, options);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as any;
  } catch {
    return null;
  }
}
