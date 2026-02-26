import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";
import { checkAdminAuth } from "@/lib/checkAdminAuth";

export async function GET() {
  await dbConnect();

  const auth = await checkAdminAuth();
  if (!auth.ok) return auth.response;

  const reviews = await Review.find()
    .populate("userId", "name email")
    .populate({
      path: "craftsmanId",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ reviews });
}