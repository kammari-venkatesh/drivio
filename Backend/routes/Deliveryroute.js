import express from "express"
import { validateDeliveryDetails, createDelivery, getPendingDeliveries,assignDelivery } from '../Controllers/Deliverycontroller.js';
const deliveryRouter = express.Router();



deliveryRouter.post('/setdelivery', validateDeliveryDetails, createDelivery);
deliveryRouter.get('/pending', getPendingDeliveries);
deliveryRouter.put("/:id/assign", assignDelivery)


export default deliveryRouter;