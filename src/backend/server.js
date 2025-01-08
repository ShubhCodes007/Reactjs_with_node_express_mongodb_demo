// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const reportRoutes = require('./routes/reportRoutes');
const captchaRoutes = require('./routes/captchaRoutes'); // Captcha routes
const svgCaptcha = require('svg-captcha');
const session = require('express-session');
const bodyParser = require('body-parser');
const MemoryStore = require('memorystore')(session);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(
    cors({
        origin: 'http://localhost:3000', // Frontend origin
        credentials: true, // Allow credentials (cookies)
    })
);
app.use(
    session({
        secret: 'SaiMohit@123', // Replace with a strong secret
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set to true if using HTTPS
        store: new MemoryStore({
            checkPeriod: 86400000, // Clear expired sessions every 24 hours
        }),
    })
);

// Captcha Routes
app.get('/api/captcha', (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text; // Store captcha text in session
    console.log('Generated captcha:', captcha.text); // Debug log
    res.json({ captcha: captcha.data });
});

app.post('/api/captcha/validate', (req, res) => {
    const { captcha } = req.body;
    console.log('Session Captcha:', req.session.captcha); // Debug log
    console.log('Provided Captcha:', captcha); // Debug log

    if (!req.session.captcha || captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
        return res.status(400).json({ message: 'Invalid captcha' });
    }

    req.session.captcha = null; // Clear captcha after validation
    res.json({ message: 'Captcha validated successfully' });
});

// Other Routes
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/captcha', captchaRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
