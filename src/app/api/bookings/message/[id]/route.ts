import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Message from "@/models/BookingMessage";
import { checkAuth } from "@/lib/checkAuth";

export async function GET(_: Request, { params }: any) {
  await dbConnect();
  const msgs = await Message.find({ bookingId: params.id }).sort({ createdAt: 1 });
  return NextResponse.json({ msgs });
}

export async function POST(req: Request, { params }: any) {
  await dbConnect();
  const { text } = await req.json();
  const auth = await checkAuth();

  await Message.create({
    bookingId: params.id,
    senderRole: auth.role,
    message: text,
  });

  return NextResponse.json({ ok: true });
}
