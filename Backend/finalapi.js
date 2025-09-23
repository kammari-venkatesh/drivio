// Import express
import express from "express"
import connectDB from "./config/db.js";// Create app
import userAuthRouter from "./routes/UserAuthrouter.js"
import driverRouter from "./routes/Driverrouter.js";
import deliveryRouter from './routes/Deliveryroute.js';
import cors from 'cors';
const app = express();
app.use(cors());

// Define a port
const PORT = 3000;

// Connect to database
connectDB();
app.use(express.json());
app.use("/api/users", userAuthRouter);
app.use("/api/drivers", driverRouter);
app.use('/api/deliveries', deliveryRouter);
// Basic route
app.get("/", (req, res) => {
  res.send("Hello, welcome to Drivio 🚗📍!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
