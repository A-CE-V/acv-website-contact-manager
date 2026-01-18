const express = require('express');
const { Resend } = require('resend'); // Faster and more modern than Nodemailer
const cors = require('cors');
require('dotenv').config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY); // Use the API Key here

app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
    const { name, reply_to, subject, message } = req.body;

    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: process.env.EMAIL_USER,
            subject: `Contact Form from ACV: ${subject}`,
            reply_to: reply_to,
            text: `Name: ${name}\nEmail: ${reply_to}\n\nMessage:\n${message}`,
        });

        res.status(200).json({ success: true, id: data.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Secure API running on port 3000'));