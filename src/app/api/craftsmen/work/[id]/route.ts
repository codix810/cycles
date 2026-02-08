import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";

export async function GET(req: Request, context: any) {
  await dbConnect();

  const { id } = await context.params; // 🔥 مهم

  const job = await Booking.findById(id)
    .populate("userId", "name phone")
    .populate({
      path: "craftsmanId",
      populate: { path: "userId", select: "name phone" }
    });

  return NextResponse.json({ job });
}

export async function PUT(req: Request, context: any) {
  await dbConnect();
  const { id } = await context.params;
  const { reply, price, decision } = await req.json();

  const booking = await Booking.findById(id);

  booking.craftsmanReply = reply;
  booking.price = price;
  booking.craftsmanDecision = decision;

  // بدل status
  booking.lastReplyBy = "craftsman";

  await booking.save();
  return NextResponse.json({ message: "Reply saved" });
}
