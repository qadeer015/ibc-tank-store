// middlewares/upload.js
const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Ensure uploads directory exists in development
if (process.env.NODE_ENV !== 'production') {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

// Configure Cloudinary for production
if (process.env.NODE_ENV === 'production') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

let storage;

if (process.env.NODE_ENV === 'production') {
  // Cloudinary storage for production
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: 'ibc-tank-store/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{
          width: 500,
          height: 500,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto'
        }]
      };
    }
  });
} else {
  // Local file storage for development
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
      // Create unique filename with timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF images are allowed.'), false);
    }
  }
});

// Helper function to get file URL/path based on environment
const getFileUrl = (file) => {
  if (process.env.NODE_ENV === 'production') {
    // For Cloudinary, file.path is the URL
    return file.path;
  } else {
    // For local development, return relative path
    return `/uploads/${path.basename(file.path)}`;
  }
};

// Helper function to delete file
const deleteFile = async (filePath) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      // Extract public_id from Cloudinary URL
      const urlParts = filePath.split('/');
      const publicIdWithExtension = urlParts.slice(urlParts.indexOf('ibc-tank-store')).join('/');
      const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));

      await cloudinary.uploader.destroy(publicId);
    } else {
      // Delete local file
      const fullPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw error for file deletion failures
  }
};

// Export
module.exports = {
  upload,
  single: (fieldName) => upload.single(fieldName),
  array: (fieldName, maxCount) => upload.array(fieldName, maxCount),
  fields: (fields) => upload.fields(fields),
  getFileUrl,
  deleteFile
};