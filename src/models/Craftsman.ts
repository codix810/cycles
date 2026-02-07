import mongoose, { Schema, Document } from "mongoose";

export interface ICraftsman extends Document {
  userId: mongoose.Types.ObjectId;
  jobTitle?: string;
  description?: string;
  experienceYears?: number;
  address?: string;
  status?: "available" | "busy";
  isApproved?: boolean;
  profileImage?: string;
  workImages?: string[];
}

const CraftsmanSchema = new Schema<ICraftsman>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  jobTitle: { type: String, default: "" },
  description: { type: String, default: "" },
  experienceYears: { type: Number, default: 0 },
  address: { type: String, default: "" },
  status: { type: String, enum: ["available", "busy"], default: "busy" },
  isApproved: { type: Boolean, default: false },
  profileImage: { type: String, default: "" },
  workImages: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.Craftsman || mongoose.model("Craftsman", CraftsmanSchema);
