import { parentPort } from 'worker_threads';
import nodemailer from 'nodemailer';

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

// Listen for messages from the parent thread
parentPort.on('message', async ({ from, to, subject, html, text }) => {
    try {
        // Set up email options
        const mailOptions = {
            from,
            to,
            subject,
            text,
            html,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        
        // Send a success message back to the parent
        parentPort.postMessage({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        // Send the error message back to the parent
        parentPort.postMessage({ success: false, error: error.message });
    }
});
