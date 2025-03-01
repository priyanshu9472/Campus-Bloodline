import express from 'express';
import {
    createDonationEvent,
    getAllDonationEvents,
    getDonationEventById,
    updateDonationEvent,
    deleteDonationEvent,
    acceptDonationEvent,
    getCurrentAcceptedDonationEvent, 
    cancelDonationEvent,
    getAllUnacceptedDonationEvents
} from '../controllers/donationEventController.js';
import { authenticateJWT } from '../middleware/auth.js'; // Assuming you have an authentication middleware

const router = express.Router();

// Create a new donation event
router.post('/create', authenticateJWT, createDonationEvent); // Protect this route

// Get all donation events
router.get('/get-all', authenticateJWT, getAllDonationEvents); // Protect this route

// Get a donation event by ID
router.get('/get/:id', authenticateJWT, getDonationEventById); // Protect this route

// Update a donation event by ID
router.put('/update/:id', authenticateJWT, updateDonationEvent); // Protect this route

// Delete a donation event by ID
router.delete('/delete/:id', authenticateJWT, deleteDonationEvent); // Protect this route

// Accept a donation event by posting user ID and Event ID
router.post('/accept', authenticateJWT, acceptDonationEvent); 
router.post('/cancel', authenticateJWT, cancelDonationEvent);
router.get('/active-event', authenticateJWT, getCurrentAcceptedDonationEvent);
router.get('/get-all-unaccepted', getAllUnacceptedDonationEvents);

export default router;
