import express from "express"
import { validateDriverDetails, registerDriverFunction,deleteDriver,verifyDriverFunction  ,getUnverifiedDrivers, getalldrivers, loginDriverFunction , getAvailableDrivers } from '../Controllers/Driverauthcontroller.js';
const driverRouter = express.Router();



driverRouter.post('/register', validateDriverDetails, registerDriverFunction);
driverRouter.post('/login', loginDriverFunction);
driverRouter.get('/available',getAvailableDrivers);
driverRouter.get('/all', getalldrivers);
driverRouter.get('/unverified', getUnverifiedDrivers);
driverRouter.patch('/acceptverify/:id', verifyDriverFunction);
driverRouter.delete('/delete/:id', deleteDriver);



export default driverRouter;