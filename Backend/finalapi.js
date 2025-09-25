// main.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userAuthRouter from "./routes/UserAuthrouter.js";
import driverRouter from "./routes/Driverrouter.js";
import deliveryRouter from "./routes/Deliveryroute.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Create HTTP server
const server = http.createServer(app);
const userSockets = new Map();
// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://drivio-k3wk.vercel.app"], // frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Attach io to all requests (must be BEFORE routes)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/users", userAuthRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/deliveries", deliveryRouter);

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, welcome to Drivio 🚗📍!");
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
   socket.on("registerUser", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`Registered user ${userId} with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
        for (const [userId, id] of userSockets.entries()) {
      if (id === socket.id) {
        userSockets.delete(userId);
        break;
      }}
    
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
export { userSockets };  