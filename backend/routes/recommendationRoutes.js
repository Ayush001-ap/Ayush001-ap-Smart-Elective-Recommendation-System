const express = require('express');
const { getRecommendations, selectCourse } = require('../controllers/recommendationController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/recommendations/:studentId', authenticate, getRecommendations);
router.post('/students/:studentId/select-course', authenticate, selectCourse);

module.exports = router;
