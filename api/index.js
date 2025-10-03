const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS 設定：允許前端網域
const allowedOrigins = [
  'https://pet-sitting-backend-4911.vercel.app',
  'https://pet-sitting-backend.vercel.app',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: function (origin, callback) {
    // 允許沒有 origin 的請求（如 Postman）
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// 基本測試路由
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Pet Sitting Platform API!' });
});

// 連接到 MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pet-sitting', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((error) => {
  console.error('MongoDB connection failed:', error);
});

// 導入路由
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/protectedRoutes');
const petRoutes = require('../routes/petRoutes');
const sitterRoutes = require('../routes/sitterRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const postRoutes = require('../routes/postRoutes');
const uploadRoutes = require('../routes/uploadRoutes');

// 使用路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/sitters', sitterRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

module.exports = (req, res) => {
  return serverless(app)(req, res);
};