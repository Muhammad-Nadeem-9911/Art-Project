const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Painting = require('../models/Painting');
const sendEmail = require('../utils/sendEmail');
const { getEmailTemplate } = require('../utils/emailTemplates');
const { protect } = require('../middleware/authMiddleware');

// Helper function to generate a JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token will expire in 30 days
    });
};

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate email verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');
        user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
        user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await user.save();

        // Send verification email
        try {
            const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
            const emailBody = `
                <p>Hi ${user.name},</p>
                <p>Thank you for registering! Please click the button below to verify your email address and complete your registration.</p>
            `;
            const emailHtml = getEmailTemplate({
                title: 'Verify Your Email Address',
                body: emailBody,
                button: {
                    text: 'Verify Email',
                    link: verificationUrl
                }
            });
        
            await sendEmail({
                to: user.email,
                subject: 'Account Verification - Iram Ali Art',
                html: emailHtml,
            });

            res.status(201).json({ success: true, message: 'Registration successful. Please check your email to verify your account.' });

        } catch (emailError) {
            console.error('Email verification error:', emailError);
            // This is a critical failure. We should probably roll back user creation or have a cleanup job.
            // For now, we'll inform the user that something went wrong.
            // The user can try to resend the verification email later.
            res.status(500).json({ message: 'User registered, but failed to send verification email. Please try resending it from the login page.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/users/login
// @desc    Authenticate a user and get a token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Check if user is verified
        if (user && !user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in.', unverified: true });
        }
        // Check if user exists and if the entered password matches the hashed password
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private (requires token)
router.get('/profile', protect, (req, res) => {
    // Because of the 'protect' middleware, the user object is attached to the request
    res.json(req.user);
});

// @route   GET api/users/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'wishlist',
            populate: {
                path: 'category',
                model: 'Service' // Ensures the category title is included for each painting
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users/wishlist
// @desc    Add a painting to user's wishlist
// @access  Private
router.post('/wishlist', protect, async (req, res) => {
    const { paintingId } = req.body;

    try {
        const painting = await Painting.findById(paintingId);
        if (!painting) {
            return res.status(404).json({ message: 'Painting not found' });
        }

        const user = await User.findById(req.user._id);
        
        // Check if painting is already in wishlist
        if (user.wishlist.includes(paintingId)) {
            return res.status(400).json({ message: 'Painting already in wishlist' });
        }

        user.wishlist.push(paintingId);
        await user.save();

        res.status(200).json(user.wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/users/wishlist/:paintingId
// @desc    Remove a painting from user's wishlist
// @access  Private
router.delete('/wishlist/:paintingId', protect, async (req, res) => {
    const { paintingId } = req.params;

    try {
        const user = await User.findById(req.user._id);

        // Pull the paintingId from the wishlist array
        user.wishlist.pull(paintingId);
        await user.save();

        res.status(200).json(user.wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users/cart
// @desc    Get user's shopping cart
// @access  Private
router.get('/cart', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'cart.painting',
            model: 'Painting',
            populate: {
                path: 'category',
                model: 'Service'
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users/cart
// @desc    Add an item to the cart (or increment quantity if it exists)
// @access  Private
router.post('/cart', protect, async (req, res) => {
    const { paintingId } = req.body;

    try {
        const user = await User.findById(req.user._id);
        const painting = await Painting.findById(paintingId);
        if (!painting) {
            return res.status(404).json({ message: 'Painting not found' });
        }

        const itemIndex = user.cart.findIndex(item => item.painting.toString() === paintingId);

        if (itemIndex > -1) {
            // Item exists, increment quantity
            user.cart[itemIndex].quantity++;
        } else {
            // Item does not exist, add to cart with quantity 1
            user.cart.push({ painting: paintingId, quantity: 1 });
        }

        await user.save();
        const populatedUser = await user.populate({ path: 'cart.painting', model: 'Painting' });
        res.status(200).json(populatedUser.cart);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/cart/:paintingId
// @desc    Update item quantity in cart
// @access  Private
router.put('/cart/:paintingId', protect, async (req, res) => {
    const { paintingId } = req.params;
    const { quantity } = req.body;

    try {
        const user = await User.findById(req.user._id);
        const itemIndex = user.cart.findIndex(item => item.painting.toString() === paintingId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            user.cart.splice(itemIndex, 1);
        } else {
            // Update quantity
            user.cart[itemIndex].quantity = quantity;
        }

        await user.save();
        const populatedUser = await user.populate({ path: 'cart.painting', model: 'Painting' });
        res.status(200).json(populatedUser.cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/users/cart/:paintingId
// @desc    Remove an item from cart
// @access  Private
router.delete('/cart/:paintingId', protect, async (req, res) => {
    const { paintingId } = req.params;

    try {
        const user = await User.findByIdAndUpdate(req.user._id, { $pull: { cart: { painting: paintingId } } }, { new: true }).populate({ path: 'cart.painting', model: 'Painting' });
        res.status(200).json(user.cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/users/cart
// @desc    Clear user's cart
// @access  Private
router.delete('/cart', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users/forgotpassword
// @desc    Forgot Password
// @access  Public
router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token (private) and save to database
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // 10 Minutes

        await user.save();

        // Create Reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/resetpassword/${resetToken}`;

        // Email Message
        const emailBody = `
            <p>You have requested a password reset for your account.</p>
            <p>Please click the button below to set a new password. This link is valid for 10 minutes.</p>
        `;
        const emailHtml = getEmailTemplate({
            title: 'Password Reset Request',
            body: emailBody,
            button: { text: 'Reset Password', link: resetUrl }
        });

        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                html: emailHtml,
            });

            res.status(200).json({ success: true, data: 'Email sent successfully.' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent. Please try again.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users/verifyemail/:token
// @desc    Verify user email
// @access  Public
router.get('/verifyemail/:token', async (req, res) => {
    // Get hashed token
    const emailVerificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    try {
        const user = await User.findOne({
            emailVerificationToken,
            emailVerificationExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/users/resend-verification
// @desc    Resend verification email
// @access  Public
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'This account has already been verified.' });
        }

        // Generate new token and send email (similar to registration)
        const verificationToken = crypto.randomBytes(20).toString('hex');
        user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
        user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
        const emailBody = `<p>Hi ${user.name},</p><p>Please click the button below to verify your email address.</p>`;
        const emailHtml = getEmailTemplate({
            title: 'Verify Your Email Address',
            body: emailBody,
            button: { text: 'Verify Email', link: verificationUrl }
        });

        await sendEmail({
            to: user.email,
            subject: 'Account Verification - Iram Ali Art',
            html: emailHtml,
        });

        res.status(200).json({ success: true, message: 'A new verification email has been sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Could not resend email.' });
    }
});

// @route   PUT api/users/resetpassword/:resetToken
// @desc    Reset Password
// @access  Public
router.put('/resetpassword/:resetToken', async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid Token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({ success: true, data: 'Password Reset Success' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;