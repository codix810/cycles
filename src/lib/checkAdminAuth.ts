// lib/checkAdminAuth.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
const jwt = require("jsonwebtoken");

export async function checkAdminAuth() {
  try {
    // use await to be safe in dev (some next versions expect promise)
    const cookieStore = await cookies();
    const token = cookieStore.get?.("token")?.value ?? cookieStore.get("token")?.value;

    if (!token)
      return { ok: false, response: NextResponse.json({ error: "غير مصرح" }, { status: 401 }) };

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return { ok: false, response: NextResponse.json({ error: "توكن فاسد" }, { status: 403 }) };
    }

    if (decoded.role !== "admin")
      return { ok: false, response: NextResponse.json({ error: "مش أدمن" }, { status: 403 }) };

    return { ok: true, decoded };
  } catch (err) {
    return { ok: false, response: NextResponse.json({ error: "خطأ في التوثيق" }, { status: 500 }) };
  }
}
