import Donation from '../models/Donation.js';

// Create a new donation
export const createDonation = async (req, res) => {
    const { donor, datetime, beneficiary, bloodQuantity, venue } = req.body;

    try {
        const newDonation = new Donation({
            donor,
            datetime,
            beneficiary,
            bloodQuantity,
            venue,
        });

        await newDonation.save();
        res.status(201).json(newDonation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating donation', error });
    }
};

// Get all donations
export const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find().populate('donor', 'username email bloodgroup');
        res.status(200).json(donations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving donations', error });
    }
};

// Get a single donation by ID
export const getDonationById = async (req, res) => {
    const { id } = req.params;

    try {
        const donation = await Donation.findById(id).populate('donor', 'username email');
        
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        
        res.status(200).json(donation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving donation', error });
    }
};

// Update a donation by ID
export const updateDonation = async (req, res) => {
    const { id } = req.params;
    const { donor, datetime, beneficiary, bloodQuantity, venue } = req.body;

    try {
        const updatedDonation = await Donation.findByIdAndUpdate(
            id,
            { donor, datetime, beneficiary, bloodQuantity, venue },
            { new: true, runValidators: true }  // Options to return the updated document and validate on update
        );

        if (!updatedDonation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        
        res.status(200).json(updatedDonation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating donation', error });
    }
};

// Delete a donation by ID
export const deleteDonation = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDonation = await Donation.findByIdAndDelete(id);
        
        if (!deletedDonation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        
        res.status(200).json({ message: 'Donation deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting donation', error });
    }
};

 // Assuming you have a User model for donor information

// Get analytics for donations
export const getDonationAnalytics = async (req, res) => {
    try {
        // Aggregate total blood quantity donated by blood group
        const bloodGroupStats = await Donation.aggregate([
            {
                $lookup: {
                    from: 'users',            // Join with the User collection
                    localField: 'donor',      // donor is the user ID in Donation
                    foreignField: '_id',      // _id is the primary key in User
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'      // Flatten the result to access user details
            },
            {
                $group: {
                    _id: '$userDetails.bloodgroup',  // Group by the correct bloodgroup field
                    totalBloodQuantity: { $sum: '$bloodQuantity' }
                }
            },
            {
                $project: {
                    bloodgroup: '$_id',             // Rename _id to bloodgroup
                    totalBloodQuantity: 1,
                    _id: 0
                }
            }
        ]);

        // Get top donors with their total blood quantity donated
        const topDonors = await Donation.aggregate([
            {
                $group: {
                    _id: '$donor', // Group by donor ID
                    totalBloodQuantity: { $sum: '$bloodQuantity' }
                }
            },
            {
                $lookup: {
                    from: 'users', // Join with users collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'donorDetails'
                }
            },
            {
                $unwind: '$donorDetails' // Flatten the result to access user details
            },
            {
                $project: {
                    donorId: '$_id',
                    username: '$donorDetails.username',
                    email: '$donorDetails.email',
                    totalBloodQuantity: 1,
                    _id: 0
                }
            },
            {
                $sort: { totalBloodQuantity: -1 } // Sort by total blood quantity in descending order
            }
        ]);

        // Return the analytics data
        res.status(200).json({
            bloodGroupStats,
            topDonors,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving donation analytics', error });
    }
};
