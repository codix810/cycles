import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Craftsman from "@/models/Craftsman";
const jwt = require("jsonwebtoken");

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      password,
      jobTitle,
      description,
      experienceYears,
      address,
      idCardImage,
      profileImage,
      workImages,
    } = body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !jobTitle ||
      !description ||
      !experienceYears ||
      !address ||
      !idCardImage ||
      !profileImage
    ) {
      return NextResponse.json(
        { error: "جميع البيانات مطلوبة" },
        { status: 400 }
      );
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "الإيميل مستخدم بالفعل" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role: "craftsman",
      isApproved: false,
    });

    const craftsman = await Craftsman.create({
      userId: user._id,
      jobTitle,
      description,
      experienceYears: Number(experienceYears),
      address,
      idCardImage,
      profileImage,
      workImages: workImages || [],
      status: "busy",
      isApproved: false,
    });

    const token = jwt.sign(
      { id: user._id.toString(), role: "craftsman" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json(
      {
        message: "تم إنشاء الحساب",
        userId: user._id.toString(),
        craftsmanId: craftsman._id.toString(),
        role: "craftsman",
        token,
      },
      { status: 201 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.log("SERVER ERROR:", err);
    return NextResponse.json(
      { error: "خطأ من السيرفر", details: String(err) },
      { status: 500 }
    );
  }
}
