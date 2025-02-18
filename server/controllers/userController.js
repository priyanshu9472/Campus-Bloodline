import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Worker } from 'worker_threads';
import path from 'path';

export const getUserByEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user data without password
        const { username, role, bloodgroup, donations, address, phone, _id } = user;
        res.status(200).json({
            id: _id,
            username,
            email,
            role,
            bloodgroup,
            donations,
            address,
            phone
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user data', error });
    }
};

// Register a new user
export const createUser = async (req, res) => {
    const { username, email, password, role, bloodgroup, address, phone } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ username, email, password, role, bloodgroup, address, phone });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Login user

// Donor Login
export const loginDonor = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.role !== 'donor') {
            return res.status(400).json({ message: 'Invalid donor credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid donor credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during donor login', error });
    }
};

// Admin Login
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.role !== 'admin') {
            return res.status(400).json({ message: 'Invalid admin credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid admin credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during admin login', error });
    }
};
// Logout user (invalidate token on client side)
export const logoutUser = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};
export const verifyUserDetails = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(403).json({ message: 'Access denied, no token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        try {
            // Find the user by id from the decoded token
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the user is an admin by finding an admin role in the database


            // Return full user details along with a boolean indicating if admin exists
            res.status(200).json({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bloodgroup: user.bloodgroup,
                donations: user.donations,
                address: user.address,
                phone: user.phone, // Boolean indicating if an admin exists in the database
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching user data', error });
        }
    });
};


// Forgot password controller - sends reset link to user's email
import { fileURLToPath } from 'url';
// Manually define __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token (valid for 1 hour)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Create reset link
        const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;

        // Define email options
        const emailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Click on this link to reset your password: ${resetLink}`,
        };

        // Initialize the email worker with the correct path
        const emailWorker = new Worker(path.resolve(__dirname, '../utils/emailWorker.js'));

        // Send the email details to the worker
        emailWorker.postMessage(emailOptions);

        // Listen for worker response
        emailWorker.on('message', (result) => {
            if (result.success) {
                res.status(200).json({ message: 'Password reset link has been sent to your email.' });
            } else {
                console.error('Error in email worker:', result.error);
                res.status(500).json({ message: 'Error sending reset link', error: result.error });
            }
            // Terminate worker after response
            emailWorker.terminate();
        });

        // Handle worker error
        emailWorker.on('error', (error) => {
            console.error('Worker error:', error);
            res.status(500).json({ message: 'Error sending reset link', error });
            emailWorker.terminate();
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending reset link', error });
    }
};

// Reset password controller - verifies token and sets a new password
export const resetPassword = async (req, res) => {
    const { password: newPassword, token } = req.body;

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'Invalid token or user does not exist' });
        }

        // Hash new password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password', error });
    }
};


export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find user by email
        const user = await User.findOne({ id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user data without password
        const { username, role, bloodgroup, donations, address, phone, _id } = user;
        res.status(200).json({
            id: _id,
            username,
            email,
            role,
            bloodgroup,
            donations,
            address,
            phone
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user data', error });
    }
};

export const getAdminExists = async (req, res) => {
    try {
        const adminExists = await User.exists({ role: 'admin' });
        if (adminExists) {
            res.status(200).json({ adminExists: true });

        } else res.status(200).json({ adminExists: false });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching admin existance', error });
    }


}