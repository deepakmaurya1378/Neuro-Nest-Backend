const express = require('express');
const router = express.Router();
const { getTherapists } = require('../controllers/therapistController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all therapists
router.get('/', authMiddleware,   getTherapists);

module.exports = router;
