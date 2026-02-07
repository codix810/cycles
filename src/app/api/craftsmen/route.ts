import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Craftsman from "@/models/Craftsman";

export async function GET() {
  await dbConnect();

  try {
    const craftsmen = await Craftsman.find({ isApproved: true })
      .populate({
        path: "userId",
        select: "name email phone role",
      })
      .lean();

    const filtered = craftsmen.filter((c) => c.userId?.role === "craftsman");

    return NextResponse.json({ craftsmen: filtered });
  } catch (err: any) {
    console.error("❌ API ERROR:", err.message);
    return NextResponse.json(
      { craftsmen: [], error: err.message },
      { status: 500 }
    );
  }
}
