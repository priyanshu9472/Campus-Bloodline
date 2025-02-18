import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    datetime: {
        type: Date,
        default: Date.now,
        required: true,
    },
    beneficiary: {
        type: String,
        required: true,
    },
    bloodQuantity: {
        type: Number,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
});

// Create Donation model
const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
