const express = require('express');
const router = express.Router();
const intakeFormController = require('../controllers/intakeFormController');

// Client API Routes
router.post('/processDocuments', intakeFormController.getFilesAsPlainTextController);

// Export router
module.exports = router;
