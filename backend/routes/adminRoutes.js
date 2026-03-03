const express = require('express');
const router = express.Router();
const CarouselSlide = require('../models/CarouselSlide');
const PageContent = require('../models/PageContent');
const Service = require('../models/Service');
const User = require('../models/User');
const Painting = require('../models/Painting');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Check for Cloudinary configuration on startup
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('FATAL ERROR: Cloudinary environment variables are not configured. Please check your .env file or hosting provider settings.');
  // In a production environment, you might want to exit if Cloudinary is essential.
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const deleteImage = (imageUrl) => {
    if (!imageUrl) return;    
    try {
        // Regex to extract the public ID from a Cloudinary URL.
        // It looks for the path between the version (e.g., /v12345/) and the file extension.
        // Example: from "https://res.cloudinary.com/.../upload/v123/art-portfolio/image.jpg"
        // it extracts "art-portfolio/image"
        const publicIdMatch = imageUrl.match(/upload\/(?:v\d+\/)?([^\.]+)/);
        if (publicIdMatch && publicIdMatch[1]) {
            const publicId = publicIdMatch[1];
            cloudinary.uploader.destroy(publicId, (err) => {
                if (err) console.error(`Failed to delete image from Cloudinary: ${publicId}`, err);
            });
        }
    } catch (e) {
        console.error('Could not parse public ID from Cloudinary URL for deletion:', imageUrl, e);
    }
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

// @route   POST api/admin/upload
// @desc    Upload an image
router.post('/upload', (req, res) => {
    const uploader = upload.single('image');
    uploader(req, res, function (err) {
        if (err) {
            console.error('Upload error:', err);
            return res.status(500).json({ msg: 'File upload failed.', error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded.' });
        }
        res.json({ imageUrl: req.file.path });
    });
});

// @route   POST api/admin/upload-multiple
// @desc    Upload multiple images
router.post('/upload-multiple', (req, res) => {
    const uploader = upload.array('images');
    uploader(req, res, function (err) {
        if (err) {
            console.error('Upload error:', err);
            return res.status(500).json({ msg: 'File upload failed.', error: err.message });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: 'No files uploaded.' });
        }
        const imageUrls = req.files.map(file => file.path);
        res.json({ imageUrls });
    });
});

// @route   POST api/admin/carousel
// @desc    Add a new carousel slide
router.post('/carousel', upload.single('image'), async (req, res) => {
    try {
        const { title, subtitle } = req.body;
        const imageUrl = req.file ? req.file.path : '';
        if (!imageUrl) {
            return res.status(400).json({ msg: 'Image is required.' });
        }
        const newSlide = await CarouselSlide.create({ title, subtitle, imageUrl });
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
router.put('/carousel/:id', upload.single('image'), async (req, res) => {
    const { title, subtitle, oldImage } = req.body;
    const updateData = { title, subtitle };

    try {
        // If a new image is uploaded, use its path and delete the old one.
        if (req.file) {
            updateData.imageUrl = req.file.path;
            if (oldImage) {
                deleteImage(oldImage);
            }
        }
        
        const updatedSlide = await CarouselSlide.findByIdAndUpdate(
            req.params.id,
            updateData,
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
router.post('/services', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageUrl = req.file ? req.file.path : '';
        if (!imageUrl) {
            return res.status(400).json({ msg: 'Image is required.' });
        }
        const newService = await Service.create({ title, description, imageUrl });
        res.status(201).json(newService);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/services/:id
// @desc    Update a service
router.put('/services/:id', upload.single('image'), async (req, res) => {
    const { title, description, oldImage } = req.body;
    const updateData = { title, description };

    try {
        if (req.file) {
            updateData.imageUrl = req.file.path;
            if (oldImage) {
                deleteImage(oldImage);
            }
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            updateData,
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
        // Set category to null for all paintings that belong to this service/category
        await Painting.updateMany({ category: req.params.id }, { $set: { category: null } });

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
// @desc    Create a new painting
router.post('/paintings', upload.array('images'), async (req, res) => {
    try {
        const { title, category, description, price, countInStock } = req.body;
        const images = req.files ? req.files.map(file => file.path) : [];
        const imageUrl = images.length > 0 ? images[0] : '';

        const newPainting = new Painting({
            title,
            category,
            description,
            price,
            countInStock,
            imageUrl,
            images
        });

        await newPainting.save();
        res.status(201).json(newPainting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT api/admin/paintings/:id
// @desc    Update a painting
router.put('/paintings/:id', upload.array('images'), async (req, res) => {
    try {
        const { title, category, description, price, countInStock, keptImages } = req.body;
        const painting = await Painting.findById(req.params.id);

        if (!painting) {
            return res.status(404).json({ message: 'Painting not found' });
        }

        painting.title = title || painting.title;
        painting.category = category || painting.category;
        painting.description = description || painting.description;
        painting.price = price || painting.price;
        painting.countInStock = countInStock || painting.countInStock;

        // Handle existing images
        let currentImages = [];
        if (keptImages) {
            if (Array.isArray(keptImages)) {
                currentImages = keptImages;
            } else {
                currentImages = [keptImages];
            }
        }

        // Delete removed images
        if (painting.images && painting.images.length > 0) {
            const imagesToDelete = painting.images.filter(img => !currentImages.includes(img));
            imagesToDelete.forEach(img => deleteImage(img));
        } else if (painting.imageUrl && !currentImages.includes(painting.imageUrl)) {
            deleteImage(painting.imageUrl);
        }

        const newImages = req.files ? req.files.map(file => file.path) : [];
        const finalImages = [...currentImages, ...newImages];
        
        painting.images = finalImages;
        painting.imageUrl = finalImages.length > 0 ? finalImages[0] : '';

        const updatedPainting = await painting.save();
        res.json(updatedPainting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE api/admin/paintings/:id
// @desc    Delete a painting
router.delete('/paintings/:id', async (req, res) => {
    try {
        const paintingId = req.params.id;
        const painting = await Painting.findById(paintingId);

        if (painting) {
            // Delete associated images from Cloudinary
            if (painting.images && painting.images.length > 0) {
                painting.images.forEach(img => deleteImage(img));
            } else if (painting.imageUrl) {
                deleteImage(painting.imageUrl);
            }

            // Remove the painting from all user wishlists and carts to prevent orphaned data
            await User.updateMany(
                {}, // An empty filter matches all documents
                { 
                    $pull: { 
                        wishlist: paintingId, 
                        cart: { painting: paintingId } 
                    } 
                }
            );
        }

        // Finally, delete the painting document itself
        await Painting.findByIdAndDelete(paintingId);
        res.json({ msg: 'Painting removed and associated user data cleaned up.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;