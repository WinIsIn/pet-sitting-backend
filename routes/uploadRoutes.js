const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const router = express.Router();

// ✅ Cloudinary 自動讀取 CLOUDINARY_URL
cloudinary.config({
  secure: true,
});

// ✅ 使用 CloudinaryStorage 取代本地存檔
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'pet-sitting/uploads',
    format: file.mimetype.split('/')[1], // 自動判斷 jpg/png
    public_id: `post-${Date.now()}`, // 檔名
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  }),
});

const upload = multer({ storage });

// ✅ 單張圖片上傳
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: '沒有上傳文件' });
    }

    return res.status(200).json({
      message: '上傳成功 ✅',
      imageUrl: req.file.path, // Cloudinary secure URL
    });
  } catch (error) {
    console.error('❌ 上傳錯誤:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

module.exports = router;
