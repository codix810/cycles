import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { checkAdminAuth } from "@/lib/checkAdminAuth";

export async function PUT(req: Request, context: any) {
  await dbConnect();

  const { id } = await context.params;

  const auth = await checkAdminAuth();
  if (!auth.ok) return auth.response;

  const booking = await Booking.findById(id);
  if (!booking)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  booking.status = "rejected";
  await booking.save();

  return NextResponse.json({ message: "Rejected" });
}
