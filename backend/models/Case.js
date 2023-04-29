// models/Case.js

const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  clientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  title: {
    type: String,
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
  valueGrade: Number,
  gradeExplanation: String,
  greenFlags: String,
  redFlags: String,
  mmProbability: Number,
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
