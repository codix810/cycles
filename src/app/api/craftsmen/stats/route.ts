import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
//import Review from "@/models/Review";
import Craftsman from "@/models/Craftsman";
import { checkAuth } from "@/lib/checkAuth";

export async function GET() {
  await dbConnect();

  const auth: any = await checkAuth();
  if (!auth.ok) return auth.response;

  const craftsman = await Craftsman.findOne({ userId: auth.userId });
  if (!craftsman) return NextResponse.json({});

  const completed = await Booking.countDocuments({
    craftsmanId: craftsman._id,
    status: "approved",
    craftsmanDecision: "accepted",
  });

  const inProgress = await Booking.countDocuments({
    craftsmanId: craftsman._id,
    status: "approved",
    craftsmanDecision: { $ne: "declined" },
  });

  const earningsAgg = await Booking.aggregate([
    {
      $match: {
        craftsmanId: craftsman._id,
        craftsmanDecision: "accepted",
      },
    },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);

  //const reviews = await Review.find({ craftsmanId: craftsman._id });
  //const rating =
  //  reviews.length > 0
  //    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
  //    : "0";

  return NextResponse.json({
    //rating,
    completed,
    inProgress,
    earnings: earningsAgg[0]?.total || 0,
  });
}
