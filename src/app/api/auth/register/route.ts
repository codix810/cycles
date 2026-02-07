import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";
const jwt = require("jsonwebtoken");

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password)
      return NextResponse.json({ error: "كل الخانات مطلوبة" }, { status: 400 });

    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ error: "الإيميل مستخدم بالفعل" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, email, phone,
      password: hashed,
      role: "client",
      isApproved: true,
    });

    const token = jwt.sign({ id: user._id, role: "client" }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const res = NextResponse.json({ message: "تم تسجيل العميل", user }, { status: 201 });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "خطأ من السيرفر" }, { status: 500 });
  }
}
