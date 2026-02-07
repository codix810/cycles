import { NextResponse } from "next/server";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function PUT(req: Request, { params }: any) {
  await dbConnect();

  const { userId } = params;

  if (!userId)
    return NextResponse.json({ error: "User ID missing" }, { status: 400 });

  const user = await User.findById(userId);

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Cycle roles
  const roles = ["client", "craftsman", "admin"];
  const nextRole = roles[(roles.indexOf(user.role) + 1) % roles.length];

  user.role = nextRole;
  await user.save();

  return NextResponse.json({ message: "Role updated", role: nextRole });
}
