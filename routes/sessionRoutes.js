// routes/sessionRoutes.js
const express = require('express');
const { createSession, getSessionsByClient, updateSessionNotes , deleteSession, updatedAppointment, chatList , getSessionsByTherapist } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/create', authMiddleware, createSession);


router.post('/chatlist/:userId',chatList)

router.get('/clientSession', authMiddleware, getSessionsByClient);
router.get('/therapistSession', authMiddleware, getSessionsByTherapist);

router.patch('/update', authMiddleware, updateSessionNotes);

router.patch('/:sessionId', authMiddleware, updatedAppointment);
router.delete('/:sessionId', authMiddleware, deleteSession);

module.exports = router;
