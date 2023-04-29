// models/Case.js

const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  clientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  clientName: String,
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
  greenFlags: {
    type: [String],
    default: [],
  },
  redFlags: {
    type: [String],
    default: [],
  },
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
