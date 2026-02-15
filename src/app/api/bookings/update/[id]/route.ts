import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { checkAuth } from "@/lib/checkAuth";

export async function PUT(req: Request, context: any) {
  await dbConnect();

  const auth: any = await checkAuth();
  if (!auth.ok) return auth.response;

  const { id } = await context.params; // ✅ لازم await

  const { details, price } = await req.json();

  const booking = await Booking.findOne({
    _id: id,
    userId: auth.userId,
    status: "pending",
  });

  if (!booking) {
    return NextResponse.json({ error: "غير مسموح" }, { status: 403 });
  }

  booking.details = details;
  booking.price = Number(price);
  await booking.save();

  return NextResponse.json({ message: "تم التعديل" });
}

