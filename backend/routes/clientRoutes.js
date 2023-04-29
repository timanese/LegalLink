const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Client API Routes
router.post('/register', clientController.register);
router.post('/login', clientController.login);

// Export router
module.exports = router;
