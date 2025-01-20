const express = require('express');
const { createEmotionEntry, getEmotionJournal, deleteEmotionEntry } = require('../controllers/emotionJournalController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/entries', authMiddleware, createEmotionEntry);
router.get('/', authMiddleware, getEmotionJournal);
router.delete('/:entryId', authMiddleware, deleteEmotionEntry);  // Change GET to DELETE for deletion

module.exports = router;
