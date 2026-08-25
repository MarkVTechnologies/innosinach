"use strict";

const mongoose = require("mongoose");

// Cached across warm serverless invocations so we reuse one connection
// instead of racing a fresh mongoose.connect() on every cold start.
let cached = global._mongooseCache;
if (!cached) cached = global._mongooseCache = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!process.env.DB_NAME) {
      console.warn("[DB] DB_NAME env var is not set — defaulting to 'realtymart_cms'. Set DB_NAME in your environment.");
    }
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME || "realtymart_cms",
        bufferCommands: false,
      })
      .then((m) => {
        console.log("[DB] MongoDB connected");
        return m;
      })
      .catch((err) => {
        cached.promise = null; // allow the next request to retry
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

mongoose.connection.on("disconnected", () => {
  cached.conn = null;
  cached.promise = null;
  console.warn("[DB] MongoDB disconnected");
});

module.exports = { connectDB };
