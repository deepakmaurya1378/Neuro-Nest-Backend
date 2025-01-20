// routes/messageRoutes.js
const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/sendMessage', authMiddleware, sendMessage);
router.post('/getMessages', authMiddleware, getMessages);

module.exports = router;
