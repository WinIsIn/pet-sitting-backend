const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, async (req, res) => {
  const { items } = req.body;
  try {
    // 驗證商品存在並獲取實際價格
    let total = 0;
    const validatedItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `商品 ${item.product} 不存在` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `商品 ${product.name} 庫存不足` });
      }
      
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      validatedItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    const newOrder = new Order({ 
      user: req.user.userId, 
      items: validatedItems, 
      total 
    });
    
    await newOrder.save();
    
    // 更新商品庫存
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    res.status(201).json({ message: '訂單已建立', order: newOrder });
  } catch (err) {
    console.error('訂單建立錯誤:', err);
    res.status(500).json({ message: '訂單建立失敗' });
  }
});

// 取得自己的訂單
router.get('/my', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: '無法取得訂單' });
  }
});

module.exports = router;
