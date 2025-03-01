import express from 'express';
import { createUser, loginDonor, loginAdmin, logoutUser, getUserByEmail, verifyUserDetails , forgotPassword, resetPassword, getUserById, getAdminExists} from '../controllers/userController.js';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/register', createUser);
router.post('/login', loginDonor);
router.post('/login-admin', loginAdmin);
router.post('/logout', authenticateJWT, logoutUser); // Protect logout route
router.post('/user-details', authenticateJWT, getUserByEmail);
router.post('/verify-user', verifyUserDetails);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/user-popper/:id', authenticateJWT, getUserById);
router.get('/admin-existance', getAdminExists);

export default router;
