import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";
import { checkAuth } from "@/lib/checkAuth";

export async function PUT(req: Request, context: any) {
  await dbConnect();

  const { id } = await context.params;
  const { rating, comment } = await req.json();

  const auth: any = await checkAuth();
  if (!auth.ok) return auth.response;

  const review = await Review.findOne({
    _id: id,
    userId: auth.userId,
  });

  if (!review)
    return NextResponse.json({ error: "غير مسموح" }, { status: 403 });

  review.rating = rating;
  review.comment = comment;

  await review.save();

  return NextResponse.json({ message: "تم التعديل" });
}
