import mongoose from 'mongoose';

// Define the DonationEvent schema
const donationEventSchema = new mongoose.Schema({
    bloodQuantity: {
        type: Number,
        required: true // This field is required
    },
    message: {
        type: String,
        required: true // This field is required
    },
    beneficiary: {
        type: String,
        required: true // This field is required
    },
    datetime: {
        type: Date,
        default: Date.now,
        required: true,
    },
    venue: {
        type: String,
        required: true // This field is required
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        default: null // Can be null if not accepted yet
    },
    bloodgroup: {
        type: String,
        enum: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Accepted', 'Pending', 'Completed'], // Status can only be one of these values
        default: 'Pending' // Default value
    }

}, { timestamps: true }); // Optional: Automatically add createdAt and updatedAt timestamps

// Create the DonationEvent model
const DonationEvent = mongoose.model('DonationEvent', donationEventSchema);

export default DonationEvent;
