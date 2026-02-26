import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import Craftsman from "@/models/Craftsman";
import { checkAuth } from "@/lib/checkAuth";

export async function GET() {
  await dbConnect();

  const auth: any = await checkAuth();
  if (!auth.ok) return auth.response;

  const craftsman = await Craftsman.findOne({
    userId: auth.userId,
  });

  if (!craftsman)
    return NextResponse.json({});

  // كل الطلبات اللي جتله
  const totalRequests = await Booking.countDocuments({
    craftsmanId: craftsman._id,
    isCancelled: false,
  });

  // اللي الأدمن وافق عليها
  const adminApproved = await Booking.countDocuments({
    craftsmanId: craftsman._id,
    status: "approved",
  });

  // المنجزة فعلاً
  const completed = await Booking.countDocuments({
    craftsmanId: craftsman._id,
    status: "approved",
    craftsmanDecision: "accepted",
  });

  // الأرباح
  const earningsAgg = await Booking.aggregate([
    {
      $match: {
        craftsmanId: craftsman._id,
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
    totalRequests,
    adminApproved,
    completed,
    earnings: earningsAgg[0]?.total || 0,
  });
}