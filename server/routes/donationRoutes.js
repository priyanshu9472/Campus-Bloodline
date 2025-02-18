import express from 'express';
import { 
    createDonation, 
    getAllDonations, 
    getDonationById, 
    updateDonation, 
    deleteDonation ,
    getDonationAnalytics,
    
    
    
} from '../controllers/donationController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Donation routes
router.post('/create', authenticateJWT, createDonation);            
router.get('/get-all', authenticateJWT, getAllDonations);           
router.get('/get/:id', authenticateJWT, getDonationById);        
router.put('/update/:id', authenticateJWT, updateDonation);          
router.delete('/delete/:id',authenticateJWT, deleteDonation);    
router.get('/analytics', authenticateJWT, getDonationAnalytics);




export default router;
