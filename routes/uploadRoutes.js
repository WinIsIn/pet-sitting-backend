const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const router = express.Router();

// ✅ Cloudinary 設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ 設定上傳儲存策略
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'pet-sitting-profile', // 圖片儲存在這個資料夾
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });

// ✅ 上傳新圖片並刪除舊圖片
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: '沒有上傳文件' });
    }

    const imageUrl = req.file.path;
    const publicId = req.file.filename; // Cloudinary 自動生成的 ID

    // ✅ 如果傳入舊圖片 URL，則刪除舊圖片
    const oldImageUrl = req.body.oldImageUrl;
    if (oldImageUrl) {
      const match = oldImageUrl.match(/\/pet-sitting-profile\/([^/]+)\.[a-z]+$/i);
      if (match) {
        const oldPublicId = `pet-sitting-profile/${match[1]}`;
        try {
          await cloudinary.uploader.destroy(oldPublicId);
          console.log(`🧹 已刪除舊圖片: ${oldPublicId}`);
        } catch (delErr) {
          console.warn('⚠️ 刪除舊圖片失敗:', delErr.message);
        }
      }
    }

    // ✅ 回傳新的圖片 URL 與 public_id
    res.status(200).json({
      message: '上傳成功',
      imageUrl,
      publicId,
    });
  } catch (error) {
    console.error('❌ 上傳錯誤:', error);
    res.status(500).json({ message: '圖片上傳失敗', error: error.message });
  }
});

module.exports = router;
