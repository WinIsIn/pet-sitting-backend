const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// 圖片上傳端點（返回假 URL）
router.post('/', authenticate, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '沒有上傳文件' });
    }

    // 回傳假 URL（暫時解決方案）
    const fakeUrl = `https://via.placeholder.com/400x300/cccccc/666666?text=Uploaded+Image`;
    res.json({
      url: fakeUrl,
      public_id: `img-${Date.now()}-${Math.round(Math.random() * 1e9)}`
    });
  } catch (error) {
    console.error('圖片上傳錯誤:', error);
    res.status(500).json({ message: '圖片上傳失敗' });
  }
});

// 錯誤處理中間件
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: '圖片大小不能超過 5MB！' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: '只能上傳一個文件！' });
    }
  }
  
  if (error.message === '只允許上傳圖片文件！') {
    return res.status(400).json({ message: error.message });
  }
  
  console.error('上傳錯誤:', error);
  res.status(500).json({ message: '上傳失敗' });
});

module.exports = router;



