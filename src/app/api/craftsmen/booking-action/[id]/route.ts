import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { checkAuth } from "@/lib/checkAuth";
import Craftsman from "@/models/Craftsman";

export async function PUT(req: Request, { params }: any) {
  await dbConnect();
  const { id } = params;
  const { price, action } = await req.json(); // accepted | declined

  const auth = await checkAuth();
  if (!auth.ok) return auth.response;


const craftsman = await Craftsman.findOne({ userId: auth.userId });
if (!craftsman) return NextResponse.json({ error: "not craftsman" }, { status: 403 });

const booking = await Booking.findById(params.id);
if (!booking || booking.craftsmanId.toString() !== craftsman._id.toString())
  return NextResponse.json({ error: "forbidden" }, { status: 403 });


  booking.price = price;
  booking.craftsmanStatus = action;

  await booking.save();
  return NextResponse.json({ message: "Updated" });
}
