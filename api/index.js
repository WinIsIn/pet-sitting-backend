const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const app = express();

// CORS 設定
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json());

// 基本測試路由
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Pet Sitting Platform API!' });
});

// API 路由
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