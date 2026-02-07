import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Craftsman from "@/models/Craftsman";

export async function PUT(req: Request, context: any) {
  await dbConnect();

  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "User ID missing" }, { status: 400 });

    const body = await req.json();

    const {
      name,
      email,
      phone,
      role,
      jobTitle,
      description,
      experienceYears,
      address,
      status,
      isApproved,
    } = body;

    // Update user
    const userUpdate: any = {};
    if (name) userUpdate.name = name;
    if (email) userUpdate.email = email;
    if (phone) userUpdate.phone = phone;
    if (role) userUpdate.role = role;

    const updatedUser = await User.findByIdAndUpdate(id, userUpdate, { new: true });

    if (!updatedUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Update craftsman if exists
    const craftsman = await Craftsman.findOne({ userId: id });

    let updatedCraftsman = null;
if (craftsman) {
  const craftsmanUpdate: any = {};

  if (jobTitle !== undefined) craftsmanUpdate.jobTitle = jobTitle;
  if (description !== undefined) craftsmanUpdate.description = description;
  if (experienceYears !== undefined)
    craftsmanUpdate.experienceYears = Number(experienceYears);
  if (address !== undefined) craftsmanUpdate.address = address;
  if (status !== undefined) craftsmanUpdate.status = status;

  if (isApproved !== undefined) {
    craftsmanUpdate.isApproved =
      isApproved === true ||
      isApproved === "true" ||
      isApproved === 1 ||
      isApproved === "1";
  }

  updatedCraftsman = await Craftsman.findByIdAndUpdate(
    craftsman._id,
    craftsmanUpdate,
    { new: true }
  );
}


    return NextResponse.json({
      message: "تم التعديل بنجاح",
      user: updatedUser,
      craftsman: updatedCraftsman,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server Error", details: err.message },
      { status: 500 }
    );
  }
}
