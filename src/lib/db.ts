import mongoose from "mongoose";
import { getEnv } from "./env";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI env var missing");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null };
}

cached = global._mongoose;

export async function connectDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
