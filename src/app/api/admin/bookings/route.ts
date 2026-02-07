import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Craftsman from "@/models/Craftsman";
import { checkAdminAuth } from "@/lib/checkAdminAuth";

export async function GET() {
  await dbConnect();

  const auth = await checkAdminAuth();
  if (!auth.ok) return auth.response;

  try {
const bookings = await Booking.find()
  .populate("userId", "name phone email")
  .populate({
    path: "craftsmanId",
    populate: {
      path: "userId",
      select: "name phone email",
    },
  })
  .lean();

 

    return NextResponse.json({ bookings });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
