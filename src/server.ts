import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/database";

import healthRoutes from "./routes/health";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import orderRoutes from "./routes/orders";
import productRoutes from "./routes/products";
import restaurantRoutes from "./routes/restaurants";
import adminRoutes from "./routes/admin";
import analyticsRoutes from "./routes/analytics";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "not_found", message: "Route not found" });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`QuickBite API running on http://localhost:${PORT}`);
  });
};

start();

export default app;
