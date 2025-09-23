import express from 'express';
import { Validateuserdetails, addNewUser , getuserVerified, loginUserfunction } from '../Controllers/registrationcontroller.js';


const userAuthRouter = express.Router();

userAuthRouter.post('/register', Validateuserdetails, addNewUser);
userAuthRouter.post('/login', loginUserfunction);


// In your main server file (e.g., finalapi.js) or a dedicated routes file



export default userAuthRouter;