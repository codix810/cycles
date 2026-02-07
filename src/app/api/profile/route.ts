import { NextResponse } from "next/server";
import { headers } from "next/headers";
const jwt = require("jsonwebtoken");
import User from "@/models/User";
import Craftsman from "@/models/Craftsman";
import { dbConnect } from "@/lib/db";

export async function GET() {
  await dbConnect();

  try {
    console.log("=== PROFILE API START ===");

    // قراءة الكوكيز من الهيدر
    const headerList = await headers();
    const cookieHeader = headerList.get("cookie") || "";

    let token = null;
    const cookiesArr = cookieHeader.split(";");

    for (const c of cookiesArr) {
      const [key, value] = c.trim().split("=");
      if (key === "token") token = value;
    }

    console.log("TOKEN:", token);

    if (!token) {
      return NextResponse.json(
        { error: "غير مسجل. لا يوجد توكن." },
        { status: 401 }
      );
    }

    // فك التوكن
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("DECODED:", decoded);
    } catch (err) {
      return NextResponse.json(
        { error: "توكن غير صالح." },
        { status: 401 }
      );
    }

    // نجيب المستخدم
    const user = (await User.findById(decoded.id).lean()) as any;
    console.log("USER FOUND:", user);

    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود." },
        { status: 404 }
      );
    }

    // لو المستخدم صنايعي → نجيب بيانات الصنايعي معه
    if (user.role === "craftsman") {
      const craftsman = await Craftsman.findOne({ userId: user._id }).lean();
      console.log("CRAFTSMAN:", craftsman);

      return NextResponse.json({
        role: "craftsman",
        user,
        craftsman,
      });
    }

    // لو المستخدم عميل أو أدمن
    return NextResponse.json({
      role: user.role,
      user,
    });

  } catch (err: any) {
    console.log("PROFILE ERROR:", err);
    return NextResponse.json(
      { error: "خطأ في السيرفر", details: err.message },
      { status: 500 }
    );
  }
}
