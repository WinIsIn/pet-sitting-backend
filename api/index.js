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

// 基本 API 路由
app.get('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

app.get('/api/upload', (req, res) => {
  res.json({ message: 'Upload endpoint' });
});

app.post('/api/upload', (req, res) => {
  res.json({ message: 'Upload endpoint' });
});

// 其他 API 路由
app.get('/api/*', (req, res) => {
  res.json({ message: 'API endpoint', path: req.path });
});

app.post('/api/*', (req, res) => {
  res.json({ message: 'API endpoint', path: req.path });
});

module.exports = (req, res) => {
  return serverless(app)(req, res);
};