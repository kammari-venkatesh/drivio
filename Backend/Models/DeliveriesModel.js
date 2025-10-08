// models/DeliveriesModel.js
import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver_id: {
      type:String,
      ref: "Driver",
      default: null,
    },
    vehicle_id: {
      type: String,
      ref: "Vehicle",
      default: null,
    },
    pickup_location: {
      type: String,
      required: true,
    },
    dropoff_location: {
      type: String,
      required: true,
    },
    scheduled_pickup_time: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes later
    },
    scheduled_dropoff_time: {
      type: Date,
      default: () => new Date(Date.now() + 65 * 60 * 1000), // 65 minutes later
    },
    actual_pickup_time: {
      type: Date,
      default: null,
    },
    actual_dropoff_time: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "on_route", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
