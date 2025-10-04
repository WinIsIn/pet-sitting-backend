const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS 設定：允許所有來源（Railway 部署用）
app.use(cors({
  origin: [
    'https://pet-sitting-backend.vercel.app',
    'https://pet-sitting-frontend.vercel.app',
    'https://pet-sitting-backend-production.up.railway.app',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
  credentials: true,
  optionsSuccessStatus: 200 // 支援舊版瀏覽器
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// 測試路由
app.get('/', (req, res) => {
  res.send('Pet Sitting API is running on the cloud!');
});

// 路由設定
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api/user', protectedRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const petRoutes = require('./routes/petRoutes');
app.use('/api/pets', petRoutes);

const sitterRoutes = require('./routes/sitterRoutes');
app.use('/api/sitters', sitterRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

// 全域錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('Global error:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: 'Data validation failed', errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  res.status(500).json({ message: 'Internal server error' });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// MongoDB 連線設定
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI not set');
      process.exit(1);
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not set');
      process.exit(1);
    }

    // 連線 MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'pet_sitting'
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// 啟動伺服器（僅在直接運行此文件時）
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
