import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";
import { checkAuth } from "@/lib/checkAuth";

export async function POST(req: Request) {
  await dbConnect();
  const auth = await checkAuth();
  if (!auth.ok) return auth.response;

  const userId = auth.userId;
  const { craftsmanId, rating, comment } = await req.json();

  const review = await Review.create({ userId, craftsmanId, rating, comment });

  return NextResponse.json({ message: "تم التقييم", review });
}
