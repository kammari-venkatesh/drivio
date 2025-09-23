import express from "express"
import { validateDriverDetails, registerDriverFunction , loginDriverFunction , getAvailableDrivers } from '../Controllers/Driverauthcontroller.js';
const driverRouter = express.Router();



driverRouter.post('/register', validateDriverDetails, registerDriverFunction);
driverRouter.post('/login', loginDriverFunction);
driverRouter.get('/available',getAvailableDrivers);





export default driverRouter;