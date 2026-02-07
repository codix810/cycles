import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Craftsman from "@/models/Craftsman";

export async function GET(req: Request, context: any) {
  await dbConnect();

  try {
    const { id } = await context.params;

    const craftsman: any = await Craftsman.findById(id)
      .populate("userId", "name email phone role")
      .lean();

    if (!craftsman || !craftsman.userId || craftsman.userId.role !== "craftsman") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ craftsman });

  } catch (e) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
