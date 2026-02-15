import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { checkAuth } from "@/lib/checkAuth";

export async function PUT(req: Request, context: any) {
  await dbConnect();

  const { id } = await context.params; // 👈 مهم جدًا

  const auth: any = await checkAuth();
  if (!auth.ok) return auth.response;

  const booking = await Booking.findOne({
    _id: id,
    userId: auth.userId,
    status: "pending",
  });

  if (!booking) {
    return NextResponse.json(
      { error: "غير مسموح أو الطلب غير موجود" },
      { status: 403 }
    );
  }

  await Booking.findByIdAndDelete(id); // 👈 حذف فعلي

  return NextResponse.json({ message: "تم حذف الطلب" });
}
