import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { checkAdminAuth } from "@/lib/checkAdminAuth";

export async function DELETE(req: Request, context: any) {
  await dbConnect();
  const { id } = await context.params;

  const auth = await checkAdminAuth();
  if (!auth.ok) return auth.response;

  await Booking.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted" });
}