import express from 'express';
import connectDB from './db/connect.js';
import userRoutes from './routes/userRoutes.js';
import donationRoutes from './routes/donationRoutes.js'; // Import donation routes
import donationEventRoutes from './routes/donationEventRoutes.js';
import dotenv from 'dotenv';
import cors from "cors";
app.use(cors({ origin: "*" }));


dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// Use user and donation routes
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes); // Use donation routes
app.use('/api/donation-event', donationEventRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

const port = process.env.PORT || 3000;
const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error(error);
    }
};

start();
