import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { checkAuth } from "@/lib/checkAuth";

export async function GET() {
  await dbConnect();

  const auth: any = await checkAuth();
  if (!auth.ok) return auth.response;

  const total = await Booking.countDocuments({ userId: auth.userId });

  const completed = await Booking.countDocuments({
    userId: auth.userId,
    craftsmanDecision: "accepted",
  });

  const ongoing = await Booking.countDocuments({
    userId: auth.userId,
    status: { $in: ["pending", "approved"] },
  });

  const earningsAgg = await Booking.aggregate([
    { $match: { userId: auth.userId, craftsmanDecision: "accepted" } },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);

  return NextResponse.json({
    total,
    completed,
    ongoing,
    spent: earningsAgg[0]?.total || 0,
  });
}
