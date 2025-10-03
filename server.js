const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Support JSON requests
app.use('/uploads', express.static('uploads')); // Serve static files

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello from Pet Sitting Platform API!');
});

// All routes must be defined before connect!
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api/user', protectedRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const petRoutes = require('./routes/petRoutes');
app.use('/api/pets', petRoutes);

const sitterRoutes = require('./routes/sitterRoutes');
app.use('/api/sitters', sitterRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

// 全域錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      message: 'Data validation failed', 
      errors 
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ 
      message: `${field} already exists` 
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      message: 'Invalid token' 
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      message: 'Token expired' 
    });
  }
  
  // Default error
  res.status(500).json({ 
    message: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Resource not found' 
  });
});

// MongoDB connection configuration
const connectDB = async () => {
  try {
    // Check environment variables
    if (!process.env.MONGO_URI) {
      console.error('Error: MONGO_URI environment variable not set');
      console.log('Please create .env file and set MONGO_URI');
      console.log('Example: MONGO_URI=mongodb://localhost:27017/pet-sitting');
      process.exit(1);
    }

    if (!process.env.JWT_SECRET) {
      console.error('Error: JWT_SECRET environment variable not set');
      console.log('Please create .env file and set JWT_SECRET');
      console.log('Example: JWT_SECRET=your-secret-key-here');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // Start server
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`API endpoint: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('\nTroubleshooting suggestions:');
    console.log('1. Check if MongoDB service is running');
    console.log('2. Check if MONGO_URI connection string is correct');
    console.log('3. Check network connection and firewall settings');
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Export app for cloud platforms
module.exports = app;