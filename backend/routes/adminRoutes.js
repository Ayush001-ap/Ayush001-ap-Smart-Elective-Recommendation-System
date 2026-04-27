const express = require('express');
const { getAllStudents, getAnalytics } = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/admin/students', authenticate, authorizeAdmin, getAllStudents);
router.get('/admin/analytics', authenticate, authorizeAdmin, getAnalytics);

module.exports = router;
