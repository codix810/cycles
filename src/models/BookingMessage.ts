import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    senderRole: { type: String, enum: ["admin", "craftsman"], required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.BookingMessage ||
  mongoose.model("BookingMessage", MessageSchema);
