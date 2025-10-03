const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authenticate = require('../middleware/authMiddleware');
const { validate, bookingSchema } = require('../middleware/validationMiddleware');

// 建立預約（飼主）
router.post('/', authenticate, validate(bookingSchema), async (req, res) => {
  try {
    const { pet, sitter, startDate, endDate, message: bookingMessage } = req.body;
    
    // 需要從 SitterProfile 獲取對應的 User ID
    const SitterProfile = require('../models/SitterProfile');
    const sitterProfile = await SitterProfile.findById(sitter);
    
    if (!sitterProfile) {
      return res.status(400).json({ message: '找不到指定的保姆' });
    }

    const booking = new Booking({ 
      pet, 
      sitter: sitterProfile.user, // 使用 User ID 而不是 SitterProfile ID
      owner: req.user.userId, 
      startDate, 
      endDate, 
      message: bookingMessage,
      status: 'pending' 
    });
    
    await booking.save();
    
    // 返回完整的預約信息
    const populatedBooking = await Booking.findById(booking._id)
      .populate('sitter', 'name email')
      .populate('pet', 'name type')
      .populate('owner', 'name email');
    
    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error('創建預約錯誤:', err);
    res.status(500).json({ message: '建立預約失敗' });
  }
});

// 飼主：查看自己的預約
router.get('/my', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.userId })
      .populate('sitter', 'name email')
      .populate('pet', 'name type');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '無法取得預約' });
  }
});

// ✅ 保母：查看自己收到的預約
router.get('/received', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ sitter: req.user.userId })
      .populate('owner', 'name email')
      .populate('pet', 'name type')
      .populate('sitter', 'name email');
    res.json(bookings);
  } catch (err) {
    console.error('獲取保姆預約錯誤:', err);
    res.status(500).json({ message: '無法取得收到的預約' });
  }
});

// ✅ 保母：接受預約
router.patch('/:id/accept', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: '找不到預約' });

    // 只有該預約的保母本人能變更
    if (booking.sitter.toString() !== req.user.userId) {
      return res.status(403).json({ message: '只有該保母可以變更此預約狀態' });
    }
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: '此預約已被處理' });
    }

    booking.status = 'accepted';
    await booking.save();
    res.json({ message: '已接受預約', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '接受預約失敗' });
  }
});

// ✅ 保母：拒絕預約
router.patch('/:id/reject', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: '找不到預約' });

    if (booking.sitter.toString() !== req.user.userId) {
      return res.status(403).json({ message: '只有該保母可以變更此預約狀態' });
    }
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: '此預約已被處理' });
    }

    booking.status = 'rejected';
    await booking.save();
    res.json({ message: '已拒絕預約', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '拒絕預約失敗' });
  }
});

module.exports = router;
