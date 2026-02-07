import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Craftsman from "@/models/Craftsman";
import User from "@/models/User";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name") || "";
    const jobTitle = searchParams.get("jobTitle") || "";
    const status = searchParams.get("status") || "";
    const minExp = Number(searchParams.get("minExp") || 0);
    const address = searchParams.get("address") || "";

    const query: any = {};

    if (jobTitle) query.jobTitle = { $regex: jobTitle, $options: "i" };
    if (status) query.status = status;
    if (address) query.address = { $regex: address, $options: "i" };
    if (minExp > 0) query.experienceYears = { $gte: minExp };

    let craftsmen = await Craftsman.find(query)
      .populate("userId", "name email phone")
      .lean();

    if (name) {
      craftsmen = craftsmen.filter((c: any) =>
        c.userId.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    return NextResponse.json({ craftsmen });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
