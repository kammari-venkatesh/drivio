import express from 'express';
import { Validateuserdetails, addNewUser , getuserVerified, loginUserfunction,getallusers } from '../Controllers/registrationcontroller.js';


const userAuthRouter = express.Router();

userAuthRouter.post('/register', Validateuserdetails, addNewUser);
userAuthRouter.post('/login', loginUserfunction);
userAuthRouter.get('/all', getallusers);


// In your main server file (e.g., finalapi.js) or a dedicated routes file



export default userAuthRouter;