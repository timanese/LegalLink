const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");

router.post("/uploadFile", caseController.uploadFile);
router.post("/create", caseController.createCase);
router.get("/getAll/:id", caseController.getAllClientCases); // client id
router.get("/get/:id", caseController.getCase); // case id
router.patch("/acceptCase/:id", caseController.acceptCase); //case id
router.patch("/rejectCase/:id", caseController.rejectCase); // case id

module.exports = router;
