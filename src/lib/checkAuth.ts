import { cookies } from "next/headers";
import { NextResponse } from "next/server";
const jwt = require("jsonwebtoken");

export async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return { ok: true, userId: decoded.id, role: decoded.role };
  } catch (err) {
    return { ok: false, response: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
}
