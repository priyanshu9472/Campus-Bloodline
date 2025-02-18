import DonationEvent from '../models/DonationEvent.js';
import { Worker } from 'worker_threads';
import path from 'path';
import User from '../models/User.js'; // Import User model
import { fileURLToPath } from 'url';


// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createDonationEvent = async (req, res) => {
    const { bloodQuantity, message, beneficiary, venue, datetime, acceptedBy, status, bloodgroup } = req.body;

    try {
        // Fetch emails of users with matching blood group and donor role
        const users = await User.find({ bloodgroup, role: 'donor' }, 'email'); // Get only email field
        const userEmails = users.map(user => user.email);

        if (userEmails.length === 0) {
            return res.status(400).json({ message: 'No matching donor emails found' });
        }

        const newEvent = new DonationEvent({
            bloodQuantity,
            message,
            beneficiary,
            venue,
            datetime,
            acceptedBy,
            bloodgroup,
            status
        });

        await newEvent.save();


        const emailHTML = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Urgent Blood Required</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #ff0000; /* Red */
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    color: #333;
                }
                h1 {
                    margin: 0;
                    font-size: 24px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #ffcccc; /* Light red */
                    color: #b30000; /* Darker red for text */
                }
                tr:hover {
                    background-color: #ffe6e6; /* Light hover effect */
                }
                .footer {
                    background-color: #f5f5f5;
                    padding: 20px;
                    text-align: center;
                }
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #ff0000; /* Red */
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s;
                }
                .btn:hover {
                    background-color: #cc0000; /* Darker red */
                }
                @media (max-width: 600px) {
                    h1 {
                        font-size: 20px; /* Responsive heading size */
                    }
                    .container {
                        padding: 10px; /* Less padding on mobile */
                    }
                    .content {
                        padding: 15px; /* Less padding on mobile */
                    }
                    table {
                        font-size: 14px; /* Smaller table text on mobile */
                    }
                    .btn {
                        width: 100%; /* Full-width button on mobile */
                        padding: 12px; /* More padding for better touch target */
                        box-sizing: border-box; /* Ensure padding is included in width */
                    }
                }
            </style>
        </head>
        <body>
        
        <div class="container">
            <div class="header">
                <h1>Urgent Blood Required</h1>
            </div>
            <div class="content">
                <p>Dear Volunteer,</p>
                <p>We are reaching out to inform you about an urgent need for blood donations. Please find the details below:</p>
                
                <table>
                    <thead>
                        <tr>
                            <th>Blood Group</th>
                            <th>Quantity (Units)</th>
                            <th>Beneficiary</th>
                            <th>Venue</th>
                            <th>Date & Time</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${bloodgroup}</td>
                            <td>${bloodQuantity}</td>
                            <td>${beneficiary}</td>
                            <td>${venue}</td>
                            <td>${datetime}</td>
                            <td>${message}</td>
                        </tr>
                    </tbody>
                </table>
        
                <p>To view more details about the donation events, click the button below:</p>
                <a href="${process.env.BASE_URL}/dashboard/donation-events" class="btn">View Donation Events</a>
            </div>
            <div class="footer">
                <p>Thank you for your support!</p>
                <p>Best regards,<br>Campus Bloodline</p>
            </div>
        </div>
        
        </body>
        </html>`;

        // Send emails to each user using workers
        const emailPromises = userEmails.map(email => {
            return new Promise((resolve, reject) => {
                const worker = new Worker(path.resolve(__dirname, '../utils/emailWorker.js'));

                worker.postMessage({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'New Donation Event Created',
                    html: emailHTML
                });

                worker.on('message', (result) => {
                    if (result.success) {
                        resolve();
                    } else {
                        reject(result.error);
                    }
                });

                worker.on('error', reject);
                worker.on('exit', (code) => {
                    if (code !== 0) {
                        reject(new Error(`Worker stopped with exit code ${code}`));
                    }
                });
            });
        });

        await Promise.all(emailPromises);

        res.status(201).json(newEvent);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating donation event', error });
    }
};

// Get all donation events
export const getAllDonationEvents = async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is obtained from authentication middleware

    try {
        const events = await DonationEvent.find()
            .populate('acceptedBy', 'username email _id bloodgroup address phone')
            .sort({ updatedAt: -1 });

        const hasActiveEvent = await DonationEvent.exists({ acceptedBy: userId });

        res.status(200).json({
            events,
            hasActiveEvent: !!hasActiveEvent
        });
    } catch (error) {
        console.error('Error retrieving donation events:', error);
        res.status(500).json({ message: 'Error retrieving donation events', error });
    }
};

// Get a donation event by ID
export const getDonationEventById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const event = await DonationEvent.findById(id).populate('acceptedBy', 'username email');

        if (!event) {
            return res.status(404).json({ message: 'Donation event not found' });
        }

        const hasActiveEvent = await DonationEvent.exists({ acceptedBy: userId });

        res.status(200).json({
            event,
            hasActiveEvent: !!hasActiveEvent
        });
    } catch (error) {
        console.error('Error retrieving donation event:', error);
        res.status(500).json({ message: 'Error retrieving donation event', error });
    }
};

// Update a donation event by ID
export const updateDonationEvent = async (req, res) => {
    const { id } = req.params;
    const { bloodQuantity, bloodgroup, message, beneficiary, venue, datetime, acceptedBy, status } = req.body;

    try {
        const updatedEvent = await DonationEvent.findByIdAndUpdate(
            id,
            { bloodQuantity, bloodgroup, message, beneficiary, venue, datetime, acceptedBy, status },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Donation event not found' });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating donation event', error });
    }
};

// Delete a donation event by ID
export const deleteDonationEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await DonationEvent.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Donation event not found' });
        }
        res.status(200).json({ message: 'Donation event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting donation event', error });
    }
};

// Accept a donation event
export const acceptDonationEvent = async (req, res) => {
    const { eventId, userId } = req.body;

    try {
        const event = await DonationEvent.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Donation event not found' });
        }

        event.acceptedBy = userId;
        event.status = 'Accepted';

        await event.save();

        res.status(200).json({
            message: 'Donation event accepted successfully',
            event: {
                id: event._id,
                bloodQuantity: event.bloodQuantity,
                message: event.message,
                bloodgroup: event.bloodgroup,
                beneficiary: event.beneficiary,
                datetime: event.datetime,
                venue: event.venue,
                acceptedBy: event.acceptedBy,
                status: event.status,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error accepting donation event', error });
    }
};

// Cancel a donation event
export const cancelDonationEvent = async (req, res) => {
    const { eventId } = req.body;

    try {
        const event = await DonationEvent.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Donation event not found' });
        }

        event.acceptedBy = null;
        event.status = 'Pending';

        await event.save();

        res.status(200).json({ message: 'Donation event cancelled successfully' });
    } catch (err) {
        console.error("Error in cancelling donation event", err);
        res.status(500).json({ message: 'Error cancelling donation event', error: err });
    }
};

// Get currently accepted donation event for a specific user
export const getCurrentAcceptedDonationEvent = async (req, res) => {
    const userId = req.user.id;

    try {
        const acceptedEvent = await DonationEvent.findOne({ acceptedBy: userId })
            .populate('acceptedBy', 'username email');

        if (!acceptedEvent) {
            return res.status(200).json({
                message: 'Currently accepted donation event retrieved successfully',
                event: 'N/A'
            });
        }

        res.status(200).json({
            message: 'Currently accepted donation event retrieved successfully',
            event: {
                id: acceptedEvent._id,
                bloodQuantity: acceptedEvent.bloodQuantity,
                bloodgroup: acceptedEvent.bloodgroup,
                message: acceptedEvent.message,
                beneficiary: acceptedEvent.beneficiary,
                datetime: acceptedEvent.datetime,
                venue: acceptedEvent.venue,
                acceptedBy: acceptedEvent.acceptedBy,
                status: acceptedEvent.status,
            },
        });
    } catch (error) {
        console.error('Error retrieving the accepted donation event:', error);
        res.status(500).json({ message: 'Error retrieving the accepted donation event', error });
    }
};

// Get all unaccepted donation events
export const getAllUnacceptedDonationEvents = async (req, res) => {
    try {
        const unacceptedEvents = await DonationEvent.find({ acceptedBy: null })
            .sort({ updatedAt: -1 });

        res.status(200).json({
            message: 'Unaccepted donation events retrieved successfully',
            events: unacceptedEvents
        });
    } catch (error) {
        console.error('Error retrieving unaccepted donation events:', error);
        res.status(500).json({ message: 'Error retrieving unaccepted donation events', error });
    }
};
