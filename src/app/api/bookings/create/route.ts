import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Craftsman from "@/models/Craftsman";
import { checkAuth } from "@/lib/checkAuth";

export async function POST(req: Request) {
  await dbConnect();
console.log("COOKIE:", req.headers.get("cookie"));

  try {
    const auth = await checkAuth();
    if (!auth.ok) return auth.response;

    const userId = auth.userId;

    const { craftsmanId, details } = await req.json();

    if (!craftsmanId)
      return NextResponse.json({ error: "craftsmanId مطلوب" }, { status: 400 });

    const craftsman = await Craftsman.findById(craftsmanId);
    if (!craftsman)
      return NextResponse.json({ error: "الصنايعي غير موجود" }, { status: 404 });

    const booking = await Booking.create({
      userId,
      craftsmanId,
      details: details || "طلب التواصل مع الصنايعي",
      status: "pending",
    });

    return NextResponse.json({ message: "تم إرسال الطلب", booking });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server Error", details: err.message },
      { status: 500 }
    );
  }
}
