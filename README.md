# Pet Sitting Platform Backend API

This is the backend API service for a pet sitting platform, providing functionalities such as user registration, login, pet management, and sitter booking.

## Features

- User Authentication and Authorization
- Pet Data Management
- Sitter Data Management
- Booking System
- Post Sharing
- Product Management
- Order System

## Tech Stack

- **Backend Framework**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Token)
- **File Upload**: Multer
- **Data Validation**: Joi

## Environment Variables Setup

Please create a `.env` file and set the following variables:

```
MONGO_URI=mongodb://localhost:27017/pet-sitting
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Installation and Execution

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Start the production server:
```bash
npm start
```

## API Endpoints

- `GET /` - Health Check
- `POST /api/auth/register` - User Registration
- `POST /api/auth/login` - User Login
- `GET /api/pets` - Get Pet List
- `POST /api/pets` - Add New Pet
- More APIs can be found in respective route files

## Deployment

This project is configured to support Railway deployment. Please refer to `vercel.json` and `railway.json` files.