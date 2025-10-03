const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

router.get('/profile', authenticate, (req, res) => {
  res.json({
    message: '這是保護的使用者資料',
    user: req.user
  });
});

module.exports = router;
