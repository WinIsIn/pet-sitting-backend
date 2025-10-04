const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const router = express.Router();

// ✅ Cloudinary 設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL.split('@')[1],
  api_key: process.env.CLOUDINARY_URL.split('//')[1].split(':')[0],
  api_secret: process.env.CLOUDINARY_URL.split(':')[2].split('@')[0]
});

// ✅ 設定 multer 使用 Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pet-sitting/uploads',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// ✅ 單張圖片上傳
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    res.status(200).json({
      message: 'Upload successful',
      imageUrl: req.file.path, // Cloudinary secure URL
    });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

module.exports = router;

