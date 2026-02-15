import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";
import { checkAuth } from "@/lib/checkAuth";

export async function DELETE(req: Request, context: any) {
  await dbConnect();

  const { id } = await context.params;

  const auth: any = await checkAuth();
  if (!auth.ok) return auth.response;

  const review = await Review.findOne({
    _id: id,
    userId: auth.userId,
  });

  if (!review) {
    return NextResponse.json(
      { error: "غير مسموح" },
      { status: 403 }
    );
  }

  await Review.findByIdAndDelete(id);

  return NextResponse.json({ message: "تم حذف التقييم" });
}
