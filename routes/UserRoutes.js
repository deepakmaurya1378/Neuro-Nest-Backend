// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser , checkAuth, updatePassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/updatePassword', authMiddleware, updatePassword)

router.get("/check",authMiddleware, checkAuth) 

module.exports = router;
