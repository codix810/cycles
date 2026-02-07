import { NextResponse } from "next/server";
const jwt = require("jsonwebtoken");

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const token = cookie.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json({ role: "guest" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ role: decoded.role || "guest" });
  } catch (err) {
    return NextResponse.json({ role: "guest" });
  }
}
