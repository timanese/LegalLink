const express = require('express');
const router = express.Router();
const attorneyController = require('../controllers/attorneyController');

// Client API Routes
router.post('/register', attorneyController.register);
router.post('/login', attorneyController.login);

// Export router
module.exports = router;
