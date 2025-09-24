// controllers/DeliveriesController.js
import Delivery from "../Models/DeliveriesModel.js";
import UserrpModel from "../Models/Usersmodel.js";
import { userSockets } from "../finalapi.js"; // ✅ now available

export const validateDeliveryDetails = (req, res, next) => {
  const { pickup_location, dropoff_location, customer_id } = req.body;
  if (!pickup_location || !dropoff_location || !customer_id) {
    return res.status(400).json({
      message: "All fields are required.",
      status: "failed",
    });
  }
  next();
};

export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id).populate("customer_id", "username email");
    if (!delivery) {
      return res.status(404).json({   

        message: "Delivery not found",
        status: "failed",
      });
    }
    res.status(200).json({
      message: "Delivery fetched successfully",
      status: "success",
      data: delivery,
    });
  }
  catch (error) {
    console.error("Error fetching delivery by ID:", error);
    res.status(500).json({ message: "Server error fetching delivery." });
  }
};
export const updatedDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== "delivered") {
      return res.status(400).json({
        status: "failed",
        message: "Invalid status update",
      });
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      id,
      { status: status, actual_dropoff_time: new Date() },
      { new: true }
    );
    if (!updatedDelivery) {
      return res.status(404).json({
        status: "failed",
        message: "Delivery not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Delivery marked as delivered successfully",
      data: updatedDelivery,
    });
  } catch (err) {
    console.error("Error updating delivery status:", err);
    res.status(500).json({
      status: "failed",
      message: "Error updating delivery status",
      error: err.message,
    });
  }
};





export const createDelivery = async (req, res) => {
  try {
    const { pickup_location, dropoff_location, customer_id } = req.body;
    console.log("Create Delivery Request Body:", req.body);

    const newDelivery = await Delivery.create({
      customer_id,
      pickup_location,
      dropoff_location,
    });

    console.log("New Delivery Created:", newDelivery);

    // Emit the new delivery event to all connected clients
    const populatedDelivery = await newDelivery.populate("customer_id", "username email");

if (req.io) {
  req.io.emit("new_delivery_request", populatedDelivery);
}

    res.status(201).json({
      message: "Delivery created successfully",
      status: "success",
      data: newDelivery,
    });
  } catch (err) {
    console.error("Error creating delivery:", err);
    res.status(500).json({
      message: "Delivery creation failed",
      status: "failed",
      error: err.message,
    });
  }
};

export const getPendingDeliveries = async (req, res) => {
  try {
    const pendingDeliveries = await Delivery.find({ status: "pending" })
      .populate("customer_id", "username email")
      .sort({ createdAt: -1 });

    if (!pendingDeliveries || pendingDeliveries.length === 0) {
      return res.status(404).json({
        message: "No pending deliveries found",
        status: "failed",
      });
    }

    res.status(200).json({
      message: "Pending deliveries fetched successfully",
      status: "success",
      data: pendingDeliveries,
    });
  } catch (err) {
    console.error("Error fetching pending deliveries:", err);
    res.status(500).json({
      message: "Failed to fetch pending deliveries",
      status: "failed",
      error: err.message,
    });
  }
};



export const getalldeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find()
        res.status(200).json({
            message: 'Deliveries fetched successfully',
            status: 'success',
            data: deliveries
        });
    } catch (error) {
        console.error('Error fetching deliveries:', error.message);
        res.status(500).json({ message: 'Server error fetching deliveries.' });
    }
};

// export const assignDelivery = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { driver_id, vehicle_id } = req.body;

// //     if (!driver_id || !vehicle_id) {
// //       return res.status(400).json({
// //         status: "failed",
// //         message: "driver_id and vehicle_id are required",
// //       });
// //     }

// //     const updatedDelivery = await Delivery.findByIdAndUpdate(
// //       id,
// //       { driver_id, vehicle_id, status: "on_route" },
// //       { new: true }
// //     );

// //     if (!updatedDelivery) {
// //       return res.status(404).json({
// //         status: "failed",
// //         message: "Delivery not found",
// //       });
// //     }

// //     res.status(200).json({
// //       status: "success",
// //       message: "Delivery assigned successfully",
// //       data: updatedDelivery,
// //     });
// //   } catch (err) {
// //     console.error("Error assigning delivery:", err);
// //     res.status(500).json({
// //       status: "failed",
// //       message: "Error assigning delivery",
// //       error: err.message,
// //     });
// //   }
// // // };
export const assignDelivery = async (req, res, io) => {
  try {
    const { id } = req.params;
    const { driver_id, vehicle_id, status } = req.body;

    if (!driver_id || !vehicle_id || !status) {
      return res.status(400).json({
        status: "failed",
        message: "driver_id, vehicle_id, and status are required",
      });
    }

    // Fetch the delivery to assign
    const getDelivery = await Delivery.findById(id).populate("customer_id");
    if (!getDelivery) {
      return res.status(404).json({
        status: "failed",
        message: "Delivery not found",
      });
    }

    const userId = getDelivery.customer_id?._id;
    if (!userId) {
      return res.status(400).json({
        status: "failed",
        message: "Customer not found for this delivery",
      });
    }

    // Fetch all deliveries requested by the same user
    const userDeliveries = await Delivery.find({ customer_id: userId });

    // Check if any of them is on_route
    const hasOnRoute = userDeliveries.some(delivery => delivery.status === "on_route");
    if (hasOnRoute) {
      return res.status(400).json({
        status: "failed",
        message: "User already has a delivery on route",
      });
    }

    // Update the delivery
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      id,
      { driver_id, vehicle_id },
      { new: true }
    ).populate("driver_id").populate("customer_id");

    // Emit socket event if user is connected
    const customerId = updatedDelivery.customer_id?._id?.toString();
    if (customerId && userSockets.has(customerId)) {
      const socketId = userSockets.get(customerId);
      req.io.to(socketId).emit("deliveryAssigned", updatedDelivery);
      console.log(`Sent delivery update to customer ${customerId}`);
    }

    res.status(200).json({
      status: "success",
      message: "Delivery assigned successfully",
      data: updatedDelivery,
    });

  } catch (err) {
    console.error("Error assigning delivery:", err);
    res.status(500).json({
      status: "failed",
      message: "Error assigning delivery",
      error: err.message,
    });
  }
};

export const deleteDeliverybyid = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the delivery before deleting to access its customer_id (if needed)
    const deliveryToDelete = await Delivery.findById(id).populate("customer_id", "username email");

    if (!deliveryToDelete) {
      return res.status(404).json({
        message: "Delivery not found",
        status: "failed",
      });
    }

    // Delete the delivery
    await Delivery.findByIdAndDelete(id);

    // Emit a real-time event to all clients or specific user
    if (req.io) {
      const customerId = deliveryToDelete.customer_id?._id?.toString();

      // If you want to send to all clients
      req.io.emit("delivery_deleted", {
        message: "Delivery deleted",
        deliveryId: id,
      });

      // OR: If you want to send only to the customer who created the delivery
      if (customerId && userSockets.has(customerId)) {
        const socketId = userSockets.get(customerId);
        req.io.to(socketId).emit("delivery_deleted", {
          message: "Your delivery was deleted",
          deliveryId: id,
        });
      }
    }

    res.status(200).json({
      message: "Delivery deleted successfully",
      status: "success",
    });

  } catch (error) {
    console.error("Error deleting delivery:", error);
    res.status(500).json({
      message: "Server error deleting delivery.",
      status: "failed",
    });
  }
};

// In DeliveriesController.js

// export const cancelDeliveryById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const delivery = await Delivery.findByIdAndUpdate(
//       id,
//       { status: "canceled" },
//       { new: true }
//     ).populate("driver_id").populate("customer_id");

//     if (!delivery) {
//       return res.status(404).json({
//         message: "Delivery not found",
//         status: "failed"
//       });
//     }

//     // Emit to all relevant clients
//     if (req.io) {
//       // 1. Notify drivers (they're listening for "deliveryUpdated")
//       req.io.emit("deliveryUpdated", delivery);

//       // 2. Optionally notify customer
//       const customerId = delivery.customer_id?._id?.toString();
//       if (customerId && userSockets.has(customerId)) {
//         const socketId = userSockets.get(customerId);
//         req.io.to(socketId).emit("delivery_deleted", {
//           message: "Delivery was canceled",
//           deliveryId: id
//         });
//       }
//     }

//     return res.status(200).json({
//       message: "Delivery canceled successfully",
//       status: "success",
//       data: delivery
//     });

//   } catch (err) {
//     console.error("❌ Error canceling delivery:", err);
//     return res.status(500).json({
//       message: "Server error canceling delivery",
//       status: "failed",
//       error: err.message
//     });
//   }
// };
export const cancelDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findByIdAndUpdate(
      id,
      { status: "canceled" },
      { new: true }
    ).populate("driver_id").populate("customer_id");

    if (!delivery) {
      return res.status(404).json({
        message: "Delivery not found",
        status: "failed"
      });
    }

    // Emit to all relevant clients
    if (req.io) {
      // Notify **all drivers** listening for updates
      req.io.emit("deliveryUpdated", delivery);

      // Notify **specific driver**
      const driverId = delivery.driver_id?._id?.toString();
      if (driverId && userSockets.has(driverId)) {
        const socketId = userSockets.get(driverId);
        req.io.to(socketId).emit("delivery_deleted", {
          message: "Delivery was canceled",
          deliveryId: id
        });
      }

      // Notify **specific customer**
      const customerId = delivery.customer_id?._id?.toString();
      if (customerId && userSockets.has(customerId)) {
        const socketId = userSockets.get(customerId);
        req.io.to(socketId).emit("delivery_deleted", {
          message: "Delivery was canceled",
          deliveryId: id
        });
      }
    }

    return res.status(200).json({
      message: "Delivery canceled successfully",
      status: "success",
      data: delivery
    });

  } catch (err) {
    console.error("❌ Error canceling delivery:", err);
    return res.status(500).json({
      message: "Server error canceling delivery",
      status: "failed",
      error: err.message
    });
  }
};





