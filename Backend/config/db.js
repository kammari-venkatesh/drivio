import mongoose from 'mongoose'; // <-- This is the corrected line
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host} 몽고DB 연결 성공 🚀`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB; // This should already be correct