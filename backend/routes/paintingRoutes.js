const express = require('express');
const router = express.Router();
const Painting = require('../models/Painting');

// @route   GET api/paintings
// @desc    Get all paintings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const count = await Painting.countDocuments({ ...keyword });
    // Populate category to get the service title if needed
    const paintings = await Painting.find({ ...keyword })
      .populate('category', 'title')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
      
    res.json({ paintings, page, pages: Math.ceil(count / pageSize) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
 
// @route   GET api/paintings/category/:categoryId
// @desc    Get paintings by category
// @access  Public
router.get('/category/:categoryId', async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Painting.countDocuments({ category: req.params.categoryId });
    const paintings = await Painting.find({ category: req.params.categoryId })
      .populate('category', 'title')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
      
    res.json({ paintings, page, pages: Math.ceil(count / pageSize) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/paintings/:id
// @desc    Get painting by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const painting = await Painting.findById(req.params.id).populate('category', 'title');
    if (!painting) {
        return res.status(404).json({ msg: 'Painting not found' });
    }
    res.json(painting);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Painting not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;