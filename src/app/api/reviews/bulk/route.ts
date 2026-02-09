import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await dbConnect();
  const { ids } = await req.json();

  const objectIds = ids.map((id: string) => new mongoose.Types.ObjectId(id));

  const stats = await Review.aggregate([
    { $match: { craftsmanId: { $in: objectIds } } },
    {
      $group: {
        _id: "$craftsmanId",
        avg: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);

  return NextResponse.json({ stats });
}
