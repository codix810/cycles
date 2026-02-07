import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Craftsman from "@/models/Craftsman";

export async function DELETE(req: Request, context: any) {
  await dbConnect();

  try {
    const { id } = await context.params;

    if (!id)
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });

    // Delete craftsman if exists
    await Craftsman.deleteOne({ userId: id });

    // Delete user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server Error", details: err.message },
      { status: 500 }
    );
  }
}
