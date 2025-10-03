const multer = require('multer');
const path = require('path');

// 設置存儲配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 圖片存儲目錄
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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

// 創建 multer 實例
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



