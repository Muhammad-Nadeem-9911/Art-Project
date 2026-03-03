const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    painting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Painting',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Painting'
    }],
    cart: [cartItemSchema],
    emailVerificationToken: String,
    emailVerificationExpire: Date,
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const User = mongoose.model('User', UserSchema);

module.exports = User;