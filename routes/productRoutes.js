const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authenticate = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// 取得所有商品
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: '無法取得商品列表' });
  }
});

// 新增商品（admin only）
router.post('/', authenticate, isAdmin, async (req, res) => {
  const { name, description, price, imageUrl, category, stock } = req.body;
  try {
    const newProduct = new Product({ name, description, price, imageUrl, category, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: '新增商品失敗' });
  }
});

// ✅ 編輯商品（admin only）
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // 回傳更新後的資料
    );
    if (!updatedProduct) return res.status(404).json({ message: '找不到商品' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: '更新商品失敗' });
  }
});

// ✅ 刪除商品（admin only）
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: '找不到商品' });
    res.json({ message: '商品已刪除' });
  } catch (err) {
    res.status(500).json({ message: '刪除商品失敗' });
  }
});

module.exports = router;


