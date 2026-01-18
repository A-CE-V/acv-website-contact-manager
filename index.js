import express from 'express';
import { Resend } from 'resend';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
    const { name, reply_to, subject, message } = req.body;


    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }
            .header { background-color: #000; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: #fff; margin: 0; font-size: 24px; }
            .content { background-color: #fff; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; border-top: none; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; display: block; margin-bottom: 5px; }
            .value { background-color: #f4f4f4; padding: 10px; border-radius: 5px; border-left: 4px solid #000; }
            .message-box { background-color: #f4f4f4; padding: 15px; border-radius: 5px; white-space: pre-wrap; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #888; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>ACV Portfolio Contact Form message</h1>
            </div>
            <div class="content">
                <div class="field">
                    <span class="label">Subject</span>
                    <div class="value">${subject}</div>
                </div>
                
                <div class="field">
                    <span class="label">From</span>
                    <div class="value">${name} (<a href="mailto:${reply_to}">${reply_to}</a>)</div>
                </div>

                <div class="field">
                    <span class="label">Message</span>
                    <div class="message-box">${message}</div>
                </div>
            </div>
            <div class="footer">
                <p>Sent via ACV Portfolio Contact Form</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const data = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: process.env.EMAIL_USER,
            subject: `Contact: ${subject}`,
            reply_to: reply_to,
            html: htmlContent,
            text: `Name: ${name}\nEmail: ${reply_to}\n\nMessage:\n${message}`,
        });

        res.status(200).json({ success: true, id: data.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Secure API running on port 3000'));