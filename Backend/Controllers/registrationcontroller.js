import UserrpModel from "../Models/Usersmodel.js";
import { promisify } from 'util';
import  Jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


const jwtSignAsync = promisify(Jwt.sign);
const jwtVerifyAsync = promisify(Jwt.verify);
const Validateuserdetails = (req,res,next) => {
  const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    // Additional validation can be added here (e.g., email format, password strength)
    next();







}

 const loginUserfunction = async function(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.',
        status: 'failed'
       });
    }

    const user = await UserrpModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.',
        status: 'failed'
       });
    }

    // DANGER: Comparing the plain text password from the request
    // with the plain text password stored in the database.
    const isMatch = (password === user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = { userId: user._id };
    const token = await jwtSignAsync(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

    res.status(200).json({
      message: 'Logged in successfully',
      token: token,
      userId: user._id,
      username: user.username,
      status: 'success'
    });

  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
};


const getuserVerified = async function (req, res, next)  {
   try {
       const token = req.headers.authorization?.split(" ")[1];
       if (!token) {
           return res.status(401).json({ message: "Unauthorized" });
       }
       const user = await jwtVerifyAsync(token, process.env.JWT_SECRET_KEY);
       req.user = user;
         next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(403).json({ message: 'Forbidden' });
  }
};



const addNewUser = async (req,res) => {
  try {
    const userData = req.body;
    console.log('Received user data:', userData);
    

    // Create and save the new user in one step
    const createdUser = await UserrpModel.create(userData);
     res.status(201).json({
        message: 'User created successfully',
        user: createdUser
     });
    console.log('User created successfully! ✅', createdUser);
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
};










export { Validateuserdetails, addNewUser , getuserVerified, loginUserfunction };

