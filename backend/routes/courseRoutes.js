const express = require('express');
const {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/courses', authenticate, getCourses);
router.post('/courses', authenticate, authorizeAdmin, addCourse);
router.put('/courses/:id', authenticate, authorizeAdmin, updateCourse);
router.delete('/courses/:id', authenticate, authorizeAdmin, deleteCourse);

module.exports = router;
