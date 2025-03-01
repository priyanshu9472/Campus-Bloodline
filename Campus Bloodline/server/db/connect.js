import mongoose from 'mongoose';

// MongoDB connection function
const connectDB = async (uri) => {
    try {
        // Replace 'your_database_name' with the name of your MongoDB database
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
