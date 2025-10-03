const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SitterProfile = require('../models/SitterProfile');
const { validate, registerSchema, loginSchema } = require('../middleware/validationMiddleware');
const authenticate = require('../middleware/authMiddleware');

// 註冊 API
router.post('/register', validate(registerSchema), async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email 已被註冊' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: role || 'user' // 沒有傳就預設為 user
  });

    await newUser.save();
    
    // 如果註冊為保姆，自動創建保姆資料
    if (role === 'sitter') {
      const sitterProfile = new SitterProfile({
        user: newUser._id,
        bio: '專業的寵物保姆，提供優質的照顧服務',
        services: ['dog', 'cat'], // 預設服務
        ratePerDay: 500,
        location: '台北市'
      });
      await sitterProfile.save();
    }
    
    res.status(201).json({ message: '註冊成功' });

  } catch (err) {
    console.error('註冊錯誤:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email 已被註冊' });
    }
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: '資料驗證失敗', 
        errors 
      });
    }
    
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 登入 API
router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: '使用者不存在' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: '密碼錯誤' });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '登入成功',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('登入錯誤:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 更新用戶資料 API
router.put('/profile', authenticate, async (req, res) => {
  try {
    console.log('收到更新用戶資料請求:', req.body);
    console.log('用戶ID:', req.user.userId);
    
    const { avatar } = req.body;
    
    if (!avatar) {
      return res.status(400).json({ message: '缺少頭像 URL' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { avatar },
      { new: true }
    );
    
    if (!user) {
      console.log('用戶不存在，ID:', req.user.userId);
      return res.status(404).json({ message: '用戶不存在' });
    }
    
    console.log('用戶資料更新成功:', user);
    res.json({ message: '資料更新成功', user });
  } catch (err) {
    console.error('更新用戶資料錯誤:', err);
    res.status(500).json({ message: '更新失敗', error: err.message });
  }
});

module.exports = router;
