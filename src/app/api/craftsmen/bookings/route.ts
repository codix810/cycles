import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import Craftsman from "@/models/Craftsman";
import { checkAuth } from "@/lib/checkAuth";

export async function GET() {
  await dbConnect();

  const auth = await checkAuth();
  if (!auth.ok) return auth.response;

  // 1️⃣ نجيب الصنايعي المرتبط باليوزر
  const craftsman = await Craftsman.findOne({ userId: auth.userId });

  if (!craftsman) {
    return NextResponse.json({ bookings: [] });
  }

  // 2️⃣ نجيب الطلبات
  const bookings = await Booking.find({
    craftsmanId: craftsman._id,
    status: "approved", // عايز المعتمد فقط
  })
    .populate("userId", "name phone email")
    .lean();

  return NextResponse.json({ bookings });
}
