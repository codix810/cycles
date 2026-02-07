import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
const jwt = require("jsonwebtoken");

export function getUserRole(cookies: RequestCookies) {
  try {
    const token = cookies.get("token")?.value;

    if (!token) return "guest";

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    return decoded.role || "guest";
  } catch {
    return "guest";
  }
}
