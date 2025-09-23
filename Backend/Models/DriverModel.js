// models/driver.model.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Driver name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    vehicle_id: {
      type: String,
      required: [true, "Vehicle ID is required"],
      unique: true,
    },
    license_plate: {
      type: String,
      required: [true, "License plate is required"],
      unique: true,
    },
    model: {
      type: String,
      required: [true, "Vehicle model is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Vehicle capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    status: {
      type: String,
      enum: ["available", "on_route", "unavailable"],
      default: "available",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const DriverModel = mongoose.model("Driver", driverSchema);

export default DriverModel;
