import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";

export async function GET() {
  await dbConnect();

  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("userId", "name") // اسم العميل
    .populate({
      path: "craftsmanId",
      select: "jobTitle userId",
      populate: {
        path: "userId",
        select: "name"
      }
    })
    .lean();

  console.log("REVIEWS:", reviews); // 👈 شوفها في التيرمنال

  return NextResponse.json({ reviews });
}
