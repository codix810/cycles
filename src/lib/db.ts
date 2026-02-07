import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

export async function dbConnect() {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "houdaDB",
    });
    console.log("✅ Connected to Local MongoDB");
  } catch (err) {
    console.error("❌ Local MongoDB connection error:", err);
  }
}
