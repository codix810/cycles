import { NextResponse } from "next/server";
import Craftsman from "@/models/Craftsman";
import { dbConnect } from "@/lib/db";

export async function PUT(req: Request, { params }: any) {
  await dbConnect();

  const { craftsmanId } = params;

  if (!craftsmanId)
    return NextResponse.json({ error: "ID missing" }, { status: 400 });

  const craftsman = await Craftsman.findById(craftsmanId);

  if (!craftsman)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  craftsman.isApproved = true;
  await craftsman.save();

  return NextResponse.json({ message: "Craftsman approved" });
}
