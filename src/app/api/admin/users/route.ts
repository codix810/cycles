// /api/admin/users/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Craftsman from "@/models/Craftsman";
import { checkAdminAuth } from "@/lib/checkAdminAuth";

export async function GET() {
  await dbConnect();
  const auth = await checkAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const users = await User.find().lean();
    const craftsmen = await Craftsman.find().lean();
    return NextResponse.json({ users, craftsmen });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "خطأ من السيرفر" }, { status: 500 });
  }
}
