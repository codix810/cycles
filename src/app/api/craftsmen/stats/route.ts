import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { checkAuth } from "@/lib/checkAuth";

export async function GET() {
  await dbConnect();

  const auth: any = await checkAuth();
  if (!auth.ok) return auth.response;

  const userId = auth.userId;

  const total = await Booking.countDocuments({ userId });

  const completed = await Booking.countDocuments({
    userId,
    status: "approved",
    craftsmanDecision: "accepted",
  });

  const ongoing = await Booking.countDocuments({
    userId,
    status: "approved",
    craftsmanDecision: { $ne: "declined" },
  });

  // 👇 هنا المهم — نجمع السعر اللي المستخدم كتبه
  const spentAgg = await Booking.aggregate([
    {
      $match: {
        userId,
        status: "approved",
        craftsmanDecision: "accepted",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$price" },
      },
    },
  ]);

  return NextResponse.json({
    total,
    completed,
    ongoing,
    spent: spentAgg[0]?.total || 0,
  });
}
