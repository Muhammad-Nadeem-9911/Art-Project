const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  pageName: { // e.g., 'about', 'services', 'contact'
    type: String,
    required: true,
    unique: true,
  },
  heroImageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('PageContent', pageContentSchema);