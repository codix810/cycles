import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  craftsmanId: { type: Schema.Types.ObjectId, ref: "Craftsman", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);

