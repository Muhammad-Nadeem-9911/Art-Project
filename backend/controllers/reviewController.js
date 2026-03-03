const Painting = require('../models/Painting');
const Order = require('../models/Order');

// @desc    Create new review
// @route   POST /api/paintings/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment, orderId } = req.body;
    const painting = await Painting.findById(req.params.id);

    if (painting) {
        if (!orderId) {
            res.status(400);
            throw new Error('Order ID is required to submit a review.');
        }

        // 1. Find the specific order
        const order = await Order.findById(orderId);
        if (!order) {
            res.status(404);
            throw new Error('Order not found.');
        }

        // 2. Validate that the user owns the order and the product is in it
        if (order.user.toString() !== req.user._id.toString()) {
            res.status(403); // Forbidden
            throw new Error('You are not authorized to review for this order.');
        }
        const productInOrder = order.orderItems.find(item => item.painting.toString() === req.params.id);
        if (!productInOrder) {
            res.status(404);
            throw new Error('Product not found in this order.');
        }

        // 3. Check if the order is delivered
        if (order.orderStatus !== 'Delivered') {
            res.status(403);
            throw new Error('You can only review products after they have been delivered.');
        }

        // 4. Check if this product has already been reviewed FOR THIS SPECIFIC ORDER
        const alreadyReviewedForThisOrder = painting.reviews.find(
            (r) => r.user.toString() === req.user._id.toString() && r.order.toString() === orderId
        );

        if (alreadyReviewedForThisOrder) {
            res.status(400);
            throw new Error('You have already reviewed this product for this order.');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            order: orderId,
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