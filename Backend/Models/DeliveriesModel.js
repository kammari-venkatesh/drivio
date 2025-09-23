// models/Delivery.js
import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  delivery_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    index: true,
    unique: true,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userrp",
    required: true,
  },
  driver_id: {
    type: String,
    ref: "Driver",
    default: null,
  },
  vehicle_id: {
    type: String,
    ref: "Driver",
    default: null,
  },
  pickup_location: {
    type: String, // can switch to GeoJSON later
    required: true,
  },
  dropoff_location: {
    type: String,
    required: true,
  },
  scheduled_pickup_time: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    required: true,
  },
  scheduled_dropoff_time: {
    type: Date,
    default: () => new Date(Date.now() + 65 * 60 * 1000), // 5 minutes from now
    required: true,
  },
  actual_pickup_time: {
    type: Date,
    default: () => new Date(Date.now()),
  },
  actual_dropoff_time: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000),
  },
  status: {
    type: String,
    enum: ["pending", "on_route", "delivered", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
