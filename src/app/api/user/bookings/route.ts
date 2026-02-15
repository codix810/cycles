import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { checkAuth } from "@/lib/checkAuth";

export async function GET() {
  await dbConnect();

  const auth = await checkAuth();
  if (!auth.ok) return auth.response;

  const bookings = await Booking.find({ userId: auth.userId })
    .populate({
      path: "craftsmanId",
      populate: { path: "userId", select: "name profileImage" }
    })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ bookings });
}
