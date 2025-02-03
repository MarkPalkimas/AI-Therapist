// server/routes/therapy.js
const express = require('express');
const router = express.Router();
const therapyController = require('../controllers/therapyController');

router.post('/analyze', therapyController.analyze);
router.post('/feedback', therapyController.feedback);

module.exports = router;
