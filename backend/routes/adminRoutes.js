const express = require('express');
const router = express.Router();
const CarouselSlide = require('../models/CarouselSlide');
const PageContent = require('../models/PageContent');
const Service = require('../models/Service');
const Painting = require('../models/Painting');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const deleteImage = (imageUrl) => {
    if (!imageUrl) return;
    // Extract public ID from Cloudinary URL
    // Example: https://res.cloudinary.com/.../upload/v1/art-portfolio/filename.jpg
    const parts = imageUrl.split('/');
    const filename = parts.pop().split('.')[0]; // remove extension
    const publicId = `art-portfolio/${filename}`;
    
    cloudinary.uploader.destroy(publicId, (err) => {
        if (err) console.error(`Failed to delete image from Cloudinary:`, err);
    });
};

// --- Multer Setup for Cloudinary ---
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'art-portfolio', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});
const upload = multer({ storage: storage });

// @route   POST api/admin/login
// @desc    Authenticate admin user
// @access  Public
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // In a real-world app, passwords should be hashed and stored securely.
    // For this project, we'll compare against environment variables for simplicity.
    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        // For now, we send a simple success message.
        // Later, we will replace this with a secure token (JWT).
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// @route   POST api/admin/upload
// @desc    Upload an image
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded.' });
    }
    // The URL to access the file on the server
    res.json({ imageUrl: req.file.path });
});

// @route   POST api/admin/upload-multiple
// @desc    Upload multiple images
router.post('/upload-multiple', upload.array('images'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: 'No files uploaded.' });
    }
    const imageUrls = req.files.map(file => file.path);
    res.json({ imageUrls });
});

// @route   POST api/admin/carousel
// @desc    Add a new carousel slide
router.post('/carousel', async (req, res) => {
    try {
        const newSlide = await CarouselSlide.create(req.body);
        res.status(201).json(newSlide);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/carousel/:id
// @desc    Delete a carousel slide
router.delete('/carousel/:id', async (req, res) => {
    try {
        const slide = await CarouselSlide.findById(req.params.id);
        if (slide) {
            deleteImage(slide.imageUrl);
        }
        await CarouselSlide.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Slide removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/carousel/:id
// @desc    Update a carousel slide
router.put('/carousel/:id', async (req, res) => {
    const { title, subtitle, imageUrl, oldImage } = req.body;
    try {
        if (oldImage) {
            deleteImage(oldImage);
        }
        const updatedSlide = await CarouselSlide.findByIdAndUpdate(
            req.params.id,
            { title, subtitle, imageUrl },
            { new: true }
        );
        if (!updatedSlide) {
            return res.status(404).json({ msg: 'Slide not found' });
        }
        res.json(updatedSlide);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/page-content
// @desc    Get all page content
router.get('/page-content', async (req, res) => {
    try {
        const contents = await PageContent.find();
        res.json(contents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/page-content
// @desc    Create page content (Hero Image) - robustly handles upsert
router.post('/page-content', async (req, res) => {
    const { pageName, heroImageUrl } = req.body;
    try {
        const content = await PageContent.findOneAndUpdate({ pageName }, { heroImageUrl }, { new: true, upsert: true });
        res.status(201).json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/page-content
// @desc    Update page content (Hero Image) - robustly handles upsert
router.put('/page-content', async (req, res) => {
    const { pageName, heroImageUrl, oldImage } = req.body;
    try {
        if (oldImage) deleteImage(oldImage);
        const content = await PageContent.findOneAndUpdate({ pageName }, { heroImageUrl }, { new: true, upsert: true });
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/services
// @desc    Add a new service
router.post('/services', async (req, res) => {
    try {
        const newService = await Service.create(req.body);
        res.status(201).json(newService);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/services/:id
// @desc    Update a service
router.put('/services/:id', async (req, res) => {
    const { title, description, imageUrl, oldImage } = req.body;
    try {
        if (oldImage) {
            deleteImage(oldImage);
        }
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            { title, description, imageUrl },
            { new: true }
        );
        if (!updatedService) {
            return res.status(404).json({ msg: 'Service not found' });
        }
        res.json(updatedService);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/services/:id
// @desc    Delete a service
router.delete('/services/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service) {
            deleteImage(service.imageUrl);
        }
        await Service.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Service removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/paintings
// @desc    Get all paintings
router.get('/paintings', async (req, res) => {
    try {
        const paintings = await Painting.find();
        res.json(paintings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/paintings
// @desc    Add a new painting
router.post('/paintings', async (req, res) => {
    try {
        const newPainting = await Painting.create(req.body);
        res.status(201).json(newPainting);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/paintings/:id
// @desc    Update a painting
router.put('/paintings/:id', async (req, res) => {
    const { title, category, description, images, imageUrl, oldImages } = req.body;
    try {
        if (oldImages && Array.isArray(oldImages)) {
            oldImages.forEach(img => deleteImage(img));
        }
        const updatedPainting = await Painting.findByIdAndUpdate(
            req.params.id,
            { title, category, description, images, imageUrl },
            { new: true }
        );
        if (!updatedPainting) {
            return res.status(404).json({ msg: 'Painting not found' });
        }
        res.json(updatedPainting);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/paintings/:id
// @desc    Delete a painting
router.delete('/paintings/:id', async (req, res) => {
    try {
        const painting = await Painting.findById(req.params.id);
        if (painting) {
            if (painting.images && Array.isArray(painting.images)) {
                painting.images.forEach(img => deleteImage(img));
            } else if (painting.imageUrl) {
                deleteImage(painting.imageUrl);
            }
        }
        await Painting.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Painting removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;