import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { checkAuth } from "@/lib/checkAuth";

export async function GET() {
  await dbConnect();

  const auth = await checkAuth();
  if (!auth.ok) return auth.response;

  const craftsmanId = auth.userId;

  const bookings = await Booking.find({ craftsmanId })
    .populate("clientId", "name phone email")
    .lean();

  return NextResponse.json({ bookings });
}
