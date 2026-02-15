import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";
import { checkAuth } from "@/lib/checkAuth";

export async function GET() {
  await dbConnect();

  const auth: any = await checkAuth();
  if (!auth.ok) return auth.response;

  const reviews = await Review.find({ userId: auth.userId })
    .populate({
      path: "craftsmanId",
      populate: { path: "userId", select: "name" }
    })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ reviews });
}
