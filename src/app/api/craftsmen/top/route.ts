import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Craftsman from "@/models/Craftsman";
import Review from "@/models/Review";

export async function GET() {
  await dbConnect();

  const statsRaw = await Review.aggregate([
    {
      $group: {
        _id: "$craftsmanId",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    },
    { $sort: { avgRating: -1 } },
    { $limit: 4 }
  ]);

  // 🔹 نحولها Map عشان الأداء
  const statsMap = new Map(
    statsRaw.map(s => [
      String(s._id),
      {
        avg: Number(s.avgRating.toFixed(1)),
        count: s.count
      }
    ])
  );

  const ids = Array.from(statsMap.keys());

  const craftsmen = await Craftsman.find({
    _id: { $in: ids },
    isApproved: true
  })
    .populate("userId", "name")
    .lean();

  const result = craftsmen.map(c => {
    const stat = statsMap.get(String(c._id));

    return {
      ...c,
      rating: stat?.avg || 0,
      reviewCount: stat?.count || 0
    };
  });

  return NextResponse.json({ craftsmen: result });
}
