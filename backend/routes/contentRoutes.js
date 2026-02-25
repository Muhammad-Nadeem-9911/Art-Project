const express = require('express');
const router = express.Router();
const CarouselSlide = require('../models/CarouselSlide');
const PageContent = require('../models/PageContent');
const Service = require('../models/Service');

// @route   GET api/content/carousel
// @desc    Get all carousel slides
// @access  Public
router.get('/carousel', async (req, res) => {
  try {
    const slides = await CarouselSlide.find().sort({ order: 'asc' });
    res.json(slides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/content/page/:pageName
// @desc    Get content for a specific page
// @access  Public
router.get('/page/:pageName', async (req, res) => {
  try {
    const content = await PageContent.findOne({ pageName: req.params.pageName });
    if (!content) {
      return res.status(404).json({ msg: 'Page content not found' });
    }
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/content/services
// @desc    Get all services
// @access  Public
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 'asc' });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/content/paintings/:categoryId
// @desc    Get all paintings for a specific category
// @access  Public
router.get('/paintings/:categoryId', async (req, res) => {
    try {
        const paintings = await Painting.find({ category: req.params.categoryId }).sort({ createdAt: -1 });
        res.json(paintings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;