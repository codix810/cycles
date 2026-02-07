import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { checkAdminAuth } from "@/lib/checkAdminAuth";

export async function PUT(req: Request, context: any) {
  await dbConnect();

  // حل مشكلة Promise params
  const { id } = await context.params;

  const auth = await checkAdminAuth();
  if (!auth.ok) return auth.response;

  const booking = await Booking.findById(id);
  if (!booking)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  booking.status = "approved";
  await booking.save();

  return NextResponse.json({ message: "Approved" });
}
