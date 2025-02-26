
require('dotenv').config(); // Import and configure dotenv at the top of the file
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Set up CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV', // Folder in Cloudinary to store images
    allowedFormats: ['png', 'jpeg', 'jpg'], // Allowed image formats
  },
});

// Export cloudinary and storage
module.exports = {
  cloudinary,
  storage,
};
  