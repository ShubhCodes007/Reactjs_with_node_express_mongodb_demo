// backend/routes/captchaRoutes.js
const express = require('express');
const svgCaptcha = require('svg-captcha');

const router = express.Router();

// Generate Captcha
router.get('/', (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text; // Store the captcha text in the session
    console.log('Generated Captcha:', captcha.text); // Debug log
    res.json({ captcha: captcha.data });
});

// Validate Captcha
router.post('/validate', (req, res) => {
    const { captcha } = req.body;
    console.log('Session Captcha:', req.session.captcha); // Debug log
    console.log('Provided Captcha:', captcha); // Debug log

    if (!req.session.captcha || captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
        return res.status(400).json({ message: 'Invalid captcha' });
    }

    req.session.captcha = null; // Clear the captcha after successful validation
    res.json({ message: 'Captcha validated successfully' });
});

module.exports = router;
