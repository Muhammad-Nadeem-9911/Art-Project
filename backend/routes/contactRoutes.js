const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');
const { getEmailTemplate } = require('../utils/emailTemplates');

// @route   POST api/contact
// @desc    Send contact form email
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please fill out all fields.' });
    }

    const emailBody = `
        <p>You have received a new message from your website's contact form.</p><br/>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #00BCF2;">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border-color: #444;" />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    const emailHtml = getEmailTemplate({
        title: `New Inquiry: ${subject}`,
        body: emailBody
    });

    try {
        await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `Contact Form: ${subject}`,
            html: emailHtml,
            replyTo: email
        });
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Contact form email error:', error);
        res.status(500).json({ message: 'Server Error: Could not send message.' });
    }
});

module.exports = router;