const multer = require('multer');
const path = require('path');

// 簡化版：使用記憶體儲存，直接回傳 base64 或假 URL
const storage = multer.memoryStorage();

// 文件過濾器
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

// 創建 multer 實例（記憶體儲存）
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 限制
    files: 9, // 最多 9 個文件
    fieldSize: 2 * 1024 * 1024, // 2MB 欄位大小限制
    fieldNameSize: 100, // 欄位名稱長度限制
    fieldValueSize: 2 * 1024 * 1024 // 欄位值大小限制
  }
});

module.exports = upload;



