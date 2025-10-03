const Pet = require('../models/Pet');
const authenticate = require('../middleware/authMiddleware');
const { validate, petSchema } = require('../middleware/validationMiddleware');
const express = require('express');
const router = express.Router();

router.post('/', authenticate, validate(petSchema), async (req, res) => {
  try {
    const pet = new Pet({ ...req.body, owner: req.user.userId });
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(500).json({ message: '新增寵物失敗' });
  }
});

router.get('/my', authenticate, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.userId });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: '無法取得寵物' });
  }
});

// 更新寵物
router.put('/:id', authenticate, async (req, res) => {
  try {
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true }
    );
    if (!pet) {
      return res.status(404).json({ message: '寵物不存在' });
    }
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: '更新寵物失敗' });
  }
});

// 刪除寵物
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user.userId 
    });
    if (!pet) {
      return res.status(404).json({ message: '寵物不存在' });
    }
    res.json({ message: '寵物已刪除' });
  } catch (err) {
    res.status(500).json({ message: '刪除寵物失敗' });
  }
});

module.exports = router;