//src/app/api/craftsmen/my-work/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { checkAuth } from "@/lib/checkAuth";
import Craftsman from "@/models/Craftsman";

export async function GET() {
  try {
    await dbConnect();

    const auth: any = await checkAuth();
    if (!auth.ok) return auth.response;

    const craftsman = await Craftsman.findOne({ userId: auth.userId });
    if (!craftsman) {
      return NextResponse.json({ jobs: [] }); // ✅ لازم return
    }

const jobs = await Booking.find({
  craftsmanId: craftsman._id,
  status: { $ne: "rejected" } // يشوف pending + approved
})
.populate("userId", "name phone")
.sort({ createdAt: -1 });


    return NextResponse.json({ jobs }); // ✅ return أساسي
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    ); // ✅ حتى الخطأ لازم return
  }
}
