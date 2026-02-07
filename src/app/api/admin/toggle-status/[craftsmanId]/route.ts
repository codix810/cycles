import { NextResponse } from "next/server";
import Craftsman from "@/models/Craftsman";
import { dbConnect } from "@/lib/db";

export async function PUT(req: Request, { params }: any) {
  await dbConnect();

  const { craftsmanId } = params;

  const craftsman = await Craftsman.findById(craftsmanId);
  if (!craftsman)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  craftsman.status =
    craftsman.status === "available" ? "busy" : "available";

  await craftsman.save();

  return NextResponse.json({
    message: "Status updated",
    status: craftsman.status,
  });
}
