// routes/Deliveryroute.js
import express from "express";
import {
  createDelivery,
  getPendingDeliveries,
  assignDelivery,
  validateDeliveryDetails,
  getalldeliveries,
  deleteDeliverybyid,
  getDeliveryById,
  updatedDeliveryStatus,
  cancelDeliveryById
} from "../Controllers/Deliverycontroller.js";

const router = express.Router();

// Create delivery
router.post("/setdelivery", validateDeliveryDetails, createDelivery);

// Get pending deliveries
router.get("/pending", getPendingDeliveries);

// Assign delivery to driver
router.put("/:id/assign", assignDelivery);

router.get("/all", getalldeliveries);
router.delete("/:id/cancel", deleteDeliverybyid);

router.delete('/deliveries/:id/cancel', (req, res) => cancelDeliveryById(req, res));
router.get("/:id", getDeliveryById);
router.put("/:id/status", updatedDeliveryStatus);
export default router;
