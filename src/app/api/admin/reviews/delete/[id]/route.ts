import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";
import { checkAdminAuth } from "@/lib/checkAdminAuth";

export async function DELETE(req: Request, context: any) {
  await dbConnect();
  const { id } = await context.params;

  const auth = await checkAdminAuth();
  if (!auth.ok) return auth.response;

  await Review.findByIdAndDelete(id);

  return NextResponse.json({ message: "تم حذف التقييم" });
}