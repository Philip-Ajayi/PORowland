import mongoose from 'mongoose';

const MONGODB_URI = process.env.SERMON_DB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define SERMON_DB_URI in your .env.local file');
}

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}