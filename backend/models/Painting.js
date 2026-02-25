const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  images: {
    type: [String],
    default: [],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Please select a category'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Painting', paintingSchema);