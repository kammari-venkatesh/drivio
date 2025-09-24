import express from "express"
import { validateDriverDetails, registerDriverFunction , getalldrivers, loginDriverFunction , getAvailableDrivers } from '../Controllers/Driverauthcontroller.js';
const driverRouter = express.Router();



driverRouter.post('/register', validateDriverDetails, registerDriverFunction);
driverRouter.post('/login', loginDriverFunction);
driverRouter.get('/available',getAvailableDrivers);
driverRouter.get('/all', getalldrivers);




export default driverRouter;