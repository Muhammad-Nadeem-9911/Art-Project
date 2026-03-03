const Painting = require('../models/Painting');
const Order = require('../models/Order');

// @desc    Create new review
// @route   POST /api/paintings/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const painting = await Painting.findById(req.params.id);

    if (painting) {
        // Server-side validation: Check if user has purchased and received the item
        const hasPurchased = await Order.findOne({
            user: req.user._id,
            'orderItems.painting': req.params.id,
            orderStatus: 'Delivered',
        });

        if (!hasPurchased) {
            res.status(403); // Forbidden
            throw new Error('You can only review products you have purchased and received.');
        }

        const alreadyReviewed = painting.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        painting.reviews.push(review);
        painting.numReviews = painting.reviews.length;
        painting.rating =
            painting.reviews.reduce((acc, item) => item.rating + acc, 0) /
            painting.reviews.length;

        await painting.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

module.exports = { createProductReview };