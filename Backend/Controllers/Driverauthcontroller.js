import DriverModel from '../Models/DriverModel.js';
import { promisify } from 'util';
import  Jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const jwtSignAsync = promisify(Jwt.sign);
const jwtVerifyAsync = promisify(Jwt.verify);

const validateDriverDetails = (req, res, next) => {
  const { username, email, password, vehicle_id, license_plate, model, capacity } = req.body;
    if (!username || !email || !password || !vehicle_id || !license_plate || !model || !capacity) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    next();
}   


const getUnverifiedDrivers = async (req, res) => {
  try {
    // Find all drivers where isVerified is false
    const unverifiedDrivers = await DriverModel.find({ isVerified: false });

    res.status(200).json({
      message: 'Unverified drivers retrieved successfully',
      status: 'success',
      data: unverifiedDrivers,
    });
  } catch (error) {
    console.error('Error retrieving unverified drivers:', error);
    res.status(500).json({
      message: 'Failed to retrieve unverified drivers',
      status: 'failed',
      error: error.message,
    });
  }
};




const registerDriverFunction = async (req, res) => {
  try {
    console.log("🚀register is running!"); // <-- ADD THIS LINE

    const { username, email, password, vehicle_id, license_plate, model, capacity } = req.body;
    console.log("Registering driver with data:", req.body); // Debug log
    // Force isVerified = false here
    const driver = await DriverModel.create({
      username,
      email,
      password,
      vehicle_id,
      license_plate,
      model,
      capacity,
      isVerified: false, // ALWAYS false
    });

    console.log("New driver created:", driver); // Debug log

    res.status(201).json({
      message: "Driver registered successfully",
      status: "success",
      driverId: driver._id,
      isVerified: driver.isVerified,
    });
  } catch (error) {
    console.error("Error registering driver:", error);
    res.status(500).json({
      status: "failed",
      message: "Driver registration failed",
      error: error.message,
    });
  }
};



const getalldrivers = async (req, res) => {
    try {
        const drivers = await DriverModel.find();
        res.status(200).json({
            message: 'Drivers retrieved successfully',
            status: 'success',
            data: drivers
        });
    } catch (error) {
        console.error('Error retrieving drivers:', error);
        res.status(500).json({ status: 'failed', message: 'Failed to retrieve drivers', error: error.message });
    }
}
console.log("🚀 controller file is running!"); // <-- ADD THIS LINE


const loginDriverFunction = async function(req, res) {
  try {
    const { email, password } = req.body;
    console.log("Driver login attempt with:", req.body); // Debug log
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.', status: 'failed' });
    }

   const driver = await DriverModel.findOne({ email, password });
if (!driver) {
  return res.status(401).json({ 
    message: 'Invalid credentials.', 
    status: 'failed' 
  });
}
if (!driver.isVerified) {
  return res.status(403).json({ 
    message: 'Driver is not verified yet. Please wait for verification.', 
    status: 'failed' 
  });
}


    const payload = { driverId: driver._id };
    const token = await jwtSignAsync(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

    console.log('Driver logged in:', driver);

    res.status(200).json({
      message: 'Driver logged in successfully',
      status: 'success',
      token: token,
      drivername: driver.username,
      driverId: driver._id,
      vehicle_id: driver.vehicle_id,
      driver: "driver",
      driver: driver
    });
  } catch (error) {
    console.error('Error logging in driver:', error);
    res.status(500).json({ status: 'failed', message: 'Driver login failed', error: error.message });
  }
};

const getAvailableDrivers = async (req, res) => {
    try {
        const availableDrivers = await DriverModel.find({ status: 'available' });
        res.status(200).json({
            message: 'Available drivers retrieved successfully',
            status: 'success',
            drivers: availableDrivers
        });
    } catch (error) {
        console.error('Error retrieving available drivers:', error);
        res.status(500).json({ status: 'failed', message: 'Failed to retrieve available drivers', error: error.message });
    }
}
const verifyDriverFunction = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await DriverModel.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ status: 'failed', message: 'Driver not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Driver verified successfully',
      data: driver
    });
  } catch (error) {
    console.error('Error verifying driver:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Failed to verify driver',
      error: error.message
    });
  }
};
const deleteDriver = async (req, res) => {
  const driverId = req.params.id;

  try {
    const deletedDriver = await DriverModel.findByIdAndDelete(driverId);

    if (!deletedDriver) {
      return res.status(404).json({
        status: 'error',
        message: 'Driver not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Driver deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting driver',
      error: error.message,
    });
  }
};

export { validateDriverDetails, registerDriverFunction ,deleteDriver,verifyDriverFunction ,getUnverifiedDrivers, loginDriverFunction , getAvailableDrivers, getalldrivers };