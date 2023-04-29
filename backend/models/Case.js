// models/Case.js

const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  clientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pre-Intake", "Intake", "Discovery", "Closed", "Archived"],
    default: "Intake",
  },
  activeStep: {
    type: Number,
    default: 0,
  },
  valueGrade: Number,
  mmProbability: Number,
  gradeExplanation: String,
  greenFlags: String,
  redFlags: String,
  fileIds: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Case = mongoose.model("Case", caseSchema);
module.exports = Case;
