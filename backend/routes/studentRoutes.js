const express = require('express');
const { updateInterests } = require('../controllers/studentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.put('/students/:studentId/interests', authenticate, updateInterests);

module.exports = router;
