const express = require('express');
const router = express.Router();
const { createProductReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');
const Painting = require('../models/Painting');

router.route('/:id/reviews').post(protect, createProductReview);

// @route   PUT /api/paintings/:paintingId/:reviewId/reply
// @desc    Admin reply to a review
// @access  Private/Admin
router.put('/:paintingId/:reviewId/reply', protect, admin, async (req, res) => {
    const { text } = req.body;

    try {
        const painting = await Painting.findById(req.params.paintingId);

        if (painting) {
            const review = painting.reviews.id(req.params.reviewId);

            if (review) {
                review.adminReply = {
                    text,
                    createdAt: new Date(),
                };
                await painting.save();
                res.json({ message: 'Reply added' });
            } else {
                res.status(404).json({ message: 'Review not found' });
            }
        } else {
            res.status(404).json({ message: 'Painting not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;