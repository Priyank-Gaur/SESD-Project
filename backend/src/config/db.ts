import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URI=process.env.MONGO_URI||'mongodb://localhost:27017/return-fraud-detection';
export const connectDB=async (): Promise<void>=>{
  if (mongoose.connection.readyState >= 1) return;
  if (process.env.VERCEL && MONGO_URI.includes('localhost')) {
    console.error('FATAL: Missing MONGO_URI string in Vercel Dashboard!');
  }
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
