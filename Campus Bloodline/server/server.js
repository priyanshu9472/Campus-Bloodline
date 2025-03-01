import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connect.js";
import userRoutes from "./routes/userRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import donationEventRoutes from "./routes/donationEventRoutes.js";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/donation-event", donationEventRoutes);

app.get("/", (req, res) => {
  res.status(200).send("MERN Backend is Running on Vercel! 🚀");
});

// Export app for Vercel (IMPORTANT)
export default app;
