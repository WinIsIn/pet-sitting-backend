const express = require('express');
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// 配置 multer 用於圖片上傳
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 圖片存儲目錄
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // 只允許特定類型的圖片文件
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只允許上傳 JPG, PNG, GIF, WebP 格式的圖片文件！'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 限制
    files: 1, // 只允許一個文件
    fieldSize: 2 * 1024 * 1024, // 2MB 欄位大小限制
    fieldNameSize: 100, // 欄位名稱長度限制
    fieldValueSize: 2 * 1024 * 1024 // 欄位值大小限制
  }
});

// 圖片上傳端點
router.post('/', authenticate, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '沒有上傳文件' });
    }

    // 返回圖片 URL
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({
      url: imageUrl,
      filename: req.file.filename
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



