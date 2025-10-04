const SitterProfile = require('../models/SitterProfile');
const authenticate = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const profile = new SitterProfile({ ...req.body, user: req.user.userId });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: '建立保姆資料失敗' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, petType, location } = req.query;
    const query = {};
    
    if (petType) query.services = { $in: [petType] };
    if (location) query.location = new RegExp(location, 'i');
    
    const sitters = await SitterProfile.find(query)
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await SitterProfile.countDocuments(query);
    
    res.json({
      sitters,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ message: '無法取得保姆清單' });
  }
});

// 獲取單個保姆資料
router.get('/:id', async (req, res) => {
  try {
    const sitter = await SitterProfile.findById(req.params.id)
      .populate('user', 'name email avatar');
    
    if (!sitter) {
      return res.status(404).json({ message: '找不到此保姆資料' });
    }
    
    res.json(sitter);
  } catch (err) {
    console.error('獲取保姆資料錯誤:', err);
    res.status(500).json({ message: '無法取得保姆資料' });
  }
});

// 獲取當前保姆的資料
router.get('/my', authenticate, async (req, res) => {
  try {
    const sitter = await SitterProfile.findOne({ user: req.user.userId })
      .populate('user', 'name email avatar');
    
    if (!sitter) {
      return res.status(404).json({ message: '找不到保姆資料' });
    }
    
    res.json(sitter);
  } catch (err) {
    console.error('獲取保姆資料錯誤:', err);
    res.status(500).json({ message: '無法取得保姆資料' });
  }
});

// 更新保姆資料
router.put('/my', authenticate, async (req, res) => {
  try {
    console.log('收到更新請求:', req.body);
    console.log('用戶ID:', req.user.userId);
    
    const { bio, services, ratePerDay, location, imageUrl } = req.body;
    
    const sitter = await SitterProfile.findOneAndUpdate(
      { user: req.user.userId },
      { bio, services, ratePerDay, location, imageUrl },
      { new: true, upsert: true }
    ).populate('user', 'name email avatar');
    
    console.log('更新後的保姆資料:', sitter);
    res.json(sitter);
  } catch (err) {
    console.error('更新保姆資料錯誤:', err);
    console.error('錯誤詳情:', err.stack);
    res.status(500).json({ 
      message: '更新保姆資料失敗', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;
