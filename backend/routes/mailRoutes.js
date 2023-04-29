const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');

// Client API Routes
router.post('/send', mailController.sendMail);
router.get('/getAllClientMail/:id', mailController.getAllClientMail);
router.get('/getAllCaseMail/:id', mailController.getAllCaseMail);
router.get('/get/:id', mailController.getMail);
router.delete('/delete/:id', mailController.deleteMail);

// Export router
module.exports = router;
