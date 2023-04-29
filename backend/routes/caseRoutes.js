const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

router.post('/uploadFile', caseController.uploadFile);
router.post('/create', caseController.createCase);
router.get('/getAll/:id', caseController.getAllClientCases);
router.get('/get/:id', caseController.getCase);
router.patch('/acceptCase/:id', caseController.acceptCase);
router.patch('/rejectCase/:id', caseController.rejectCase);

module.exports = router;
