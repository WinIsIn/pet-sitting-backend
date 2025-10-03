const Post = require('../models/Post');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const express = require('express');
const path = require('path');
const router = express.Router();

// 獲取所有公開貼文
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, petType, tags } = req.query;
    const query = { isPublic: true };
    
    if (petType) query.petType = petType;
    if (tags) query.tags = { $in: tags.split(',') };
    
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Post.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ message: '獲取貼文失敗' });
  }
});

// 創建新貼文
router.post('/', authenticate, (req, res, next) => {
  upload.array('images', 9)(req, res, (err) => {
    if (err) {
      console.error('Multer 錯誤:', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { content, petType, location, tags } = req.body;
    
    // 處理圖片路徑
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const images = req.files ? req.files.map(file => `${baseUrl}/uploads/${file.filename}`) : [];
    
    // 處理標籤
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    const post = new Post({
      content,
      petType,
      location,
      tags: tagsArray,
      images,
      author: req.user.userId
    });
    
    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar');
    
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error('創建貼文錯誤:', err);
    res.status(500).json({ message: '創建貼文失敗' });
  }
});

// 獲取單個貼文
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar');
    
    if (!post) {
      return res.status(404).json({ message: '貼文不存在' });
    }
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: '獲取貼文失敗' });
  }
});

// 更新貼文
router.put('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.userId },
      req.body,
      { new: true }
    ).populate('author', 'name email avatar')
     .populate('likes', 'name')
     .populate('comments.user', 'name');
    
    if (!post) {
      return res.status(404).json({ message: '貼文不存在或無權限' });
    }
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: '更新貼文失敗' });
  }
});

// 刪除貼文
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.userId
    });
    
    if (!post) {
      return res.status(404).json({ message: '貼文不存在或無權限' });
    }
    
    res.json({ message: '貼文已刪除' });
  } catch (err) {
    res.status(500).json({ message: '刪除貼文失敗' });
  }
});

// 按讚/取消按讚
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '貼文不存在' });
    }
    
    const userId = req.user.userId;
    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    
    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name email avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar');
    
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: '操作失敗' });
  }
});

// 添加留言
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '貼文不存在' });
    }
    
    post.comments.push({
      user: req.user.userId,
      content
    });
    
    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name email avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar');
    
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: '添加留言失敗' });
  }
});

// 刪除留言
router.delete('/:id/comments/:commentId', authenticate, async (req, res) => {
  try {
    console.log('收到刪除留言請求:', { 
      postId: req.params.id, 
      commentId: req.params.commentId,
      userId: req.user.userId 
    });
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('貼文不存在:', req.params.id);
      return res.status(404).json({ message: '貼文不存在' });
    }
    
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      console.log('留言不存在:', req.params.commentId);
      return res.status(404).json({ message: '留言不存在' });
    }
    
    console.log('留言作者:', comment.user.toString());
    console.log('貼文作者:', post.author.toString());
    console.log('當前用戶:', req.user.userId);
    
    // 檢查是否為留言作者或貼文作者
    if (comment.user.toString() !== req.user.userId && post.author.toString() !== req.user.userId) {
      console.log('無權限刪除留言');
      return res.status(403).json({ message: '無權限刪除留言' });
    }
    
    post.comments.pull(comment._id);
    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name email avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar');
    
    console.log('留言刪除成功');
    res.json(updatedPost);
  } catch (err) {
    console.error('刪除留言錯誤:', err);
    res.status(500).json({ message: '刪除留言失敗', error: err.message });
  }
});

module.exports = router;
