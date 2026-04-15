import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const uri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/quickbite";

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
