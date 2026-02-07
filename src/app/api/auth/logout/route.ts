import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json(
    { message: "تم تسجيل الخروج" },
    { status: 200 }
  );

  // مسح الكوكي
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0),
  });

  return res;
}
