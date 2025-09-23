import Delivery from "../Models/DeliveriesModel.js";
import UserrpModel from "../Models/Usersmodel.js";


const validateDeliveryDetails = (req, res, next) => {
const { pickup_location, dropoff_location, customer_id } = req.body;
    if (!pickup_location || !dropoff_location || !customer_id) {
        return res.status(400).json({ message: 'All fields are required.' ,
        status: 'failed'
        });
    }

    next();
}
const createDelivery = async (req, res) => {
    try{
        const { pickup_location, dropoff_location, customer_id } = req.body;
        const newDelivery = await Delivery.create({
            customer_id,
            pickup_location,
            dropoff_location
        });
        res.status(201).json({ message: 'Delivery created successfully', status: 'success', data: newDelivery });
    }catch(err){
        console.error('Error creating delivery:', err);
        res.status(500).json({ message: 'Delivery creation failed', status: 'failed', error: err.message });
    }}

const getPendingDeliveries = async (req, res) => {
  try {
    const pendingDeliveries = await Delivery.find({ status: "pending" })
      .populate("customer_id", "username email") // 👈 include username here
      .sort({ createdAt: -1 });
    console.log("pending deliveries", pendingDeliveries);
 
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
const assignDelivery = async (req, res) => {
  try {
    console.log("Assign Delivery Request Body:", req.body);
    const { id } = req.params;
    const { driver_id, vehicle_id } = req.body;

    if (!driver_id || !vehicle_id) {
      return res.status(400).json({
        status: "failed",
        message: "driver_id and vehicle_id are required",
      });
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      id,
      { driver_id, vehicle_id, status: "on_route" },
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


  export { validateDeliveryDetails, createDelivery, getPendingDeliveries ,assignDelivery};