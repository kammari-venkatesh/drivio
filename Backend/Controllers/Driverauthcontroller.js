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


const registerDriverFunction = async (req, res) => {
    try {
        const { username, email, password, vehicle_id, license_plate, model, capacity } = req.body;
       
        const driver= await DriverModel.create({
            username,
            email,
            password,
            vehicle_id,
            license_plate,
            model,
            capacity
        });
        res.status(201).json({
             message: 'Driver registered successfully', 
            status: 'success',
           
        });
    } catch (error) {
        console.error('Error registering driver:', error);
        res.status(500).json({ 
            status: 'failed',
            message: 'Driver registration failed',
            error: error.message
        });     
    }
}



const loginDriverFunction = async function(req, res) {
    try {
      const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.', status: 'failed' });
        }
        const driver = await DriverModel.findOne({ email, password });
        if (!driver) {
            return res.status(401).json({ message: 'Invalid credentials.', status: 'failed' });
        }
        const payload = { driverId: driver._id };
        const token = await jwtSignAsync(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
        console.log('Driver logged in:', driver);
        res.status(200).json({
            message: 'Driver logged in successfully',
            status: 'success',
            token: token,
          
             driverId: driver._id,
            vehicle_id: driver.vehicle_id
        });
    } catch (error) {
        console.error('Error logging in driver:', error);
        res.status(500).json({ status: 'failed', message: 'Driver login failed', error: error.message });
    }
}

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

export { validateDriverDetails, registerDriverFunction , loginDriverFunction , getAvailableDrivers };