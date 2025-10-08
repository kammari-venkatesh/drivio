import UserRequest from "../Models/userrequestModel.js";

// Create a new user delivery request
export const createUserRequest = async (req, res) => {
  try {
    const { customer_id, pickup_location, dropoff_location, vehicle_type } = req.body;

    // Basic validation
    if (!customer_id || !pickup_location || !dropoff_location) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Create request
    const newRequest = await UserRequest.create({
      customer_id,
      pickup_location,
      dropoff_location,
      vehicle_type: vehicle_type || "",
      status: "pending",
    });

    res.status(201).json({ message: "Request created successfully", request: newRequest });
  } catch (error) {
    console.error("Error creating user request:", error);
    res.status(500).json({ message: "Server error while creating request", error: error.message });
  }
};

// controllers/userRequestController.js

// Get all pending user requests
export const getPendingRequests = async (req, res) => {
  try {
    // Find requests where status is 'pending'
    const pendingRequests = await UserRequest.find({ status: "pending" })
      // optional: populate customer info
      .sort({ requested_at: -1 }); // newest first

    res.status(200).json({ 
      message: "Pending requests fetched successfully", 
      requests: pendingRequests 
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ 
      message: "Server error while fetching pending requests", 
      error: error.message 
    });
  }
};
// controllers/userRequestController.js

// Delete a user request by ID
// Delete a user request by ID
export const deleteUserRequest = async (req, res) => {
  try {
    console.log("Attempting to delete request with ID:", req.params.id);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    // Use findOneAndDelete instead of findByIdAndDelete for better compatibility
    const deletedRequest = await UserRequest.findOneAndDelete({ _id: id });
    console.log("Delete operation result:", deletedRequest);
    
    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting user request:", error);
    res.status(500).json({
      message: "Server error while deleting request",
      error: error.message,
    });
  }
};
