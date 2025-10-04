const express = require('express');
const multer = require('multer');
require('dotenv').config();

const router = express.Router();

// 使用記憶體儲存（避免 Cloudinary 依賴問題）
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ 單張圖片上傳（使用 base64 編碼）
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: '沒有上傳文件' });
    }

    // 將圖片轉換為 base64 格式
    const base64 = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64}`;

    return res.status(200).json({
      message: '上傳成功 ✅',
      imageUrl: imageUrl, // Base64 格式的圖片
    });
  } catch (error) {
    console.error('❌ 上傳錯誤:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

module.exports = router;
