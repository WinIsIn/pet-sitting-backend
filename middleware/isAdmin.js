module.exports = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '只有 admin 可以執行此操作' });
  }
  next();
};
