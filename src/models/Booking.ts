import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    craftsmanId: { type: Schema.Types.ObjectId, ref: "Craftsman", required: true },
    details: { type: String, required: true },

    // حالة الطلب

   status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
},

lastReplyBy: {
  type: String,
  enum: ["admin", "craftsman", ""],
  default: ""
},

    // رسالة الأدمن
    adminMessage: { type: String, default: "" },

    // رد الصنايعي
    craftsmanReply: { type: String, default: "" },

    // السعر المقترح
    price: { type: Number },

    // قرار الصنايعي
    craftsmanDecision: {
      type: String,
      enum: ["accepted", "declined", ""],
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
