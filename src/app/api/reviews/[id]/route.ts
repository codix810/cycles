import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";

export async function GET(req: Request, { params }: any) {
  await dbConnect();

  const reviews = await Review.find({ craftsmanId: params.id }).populate("userId", "name");

  const avg = reviews.length
    ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
    : 0;

  return NextResponse.json({ reviews, avg });
}
