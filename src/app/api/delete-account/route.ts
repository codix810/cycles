import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const jwt = require("jsonwebtoken");
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Craftsman from "@/models/Craftsman";

export async function DELETE() {
  await dbConnect();

  try {
    // لازم await مع cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "غير مسجل" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // حذف المستخدم
    await User.findByIdAndDelete(decoded.id);

    // حذف ملف الصنايعي (لو موجود)
    await Craftsman.findOneAndDelete({ userId: decoded.id });

    const res = NextResponse.json({ message: "تم حذف الحساب" });

    // حذف الكوكي
    res.cookies.set("token", "", {
      path: "/",
      expires: new Date(0),
    });

    return res;
  } catch (err) {
    console.log("DELETE ACCOUNT ERROR:", err);
    return NextResponse.json(
      { error: "خطأ من السيرفر" },
      { status: 500 }
    );
  }
}
