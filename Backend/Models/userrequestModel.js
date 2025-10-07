// models/UserRequest.js
import mongoose from "mongoose";

const UserRequestSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pickup_location: { type: String, required: true },
    dropoff_location: { type: String, required: true },
    vehicle_type: { type: String }, // optional, user can specify desired vehicle
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    requested_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("UserRequest", UserRequestSchema);
