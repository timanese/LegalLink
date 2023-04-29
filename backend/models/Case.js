// models/Case.js

const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pre-Intake', 'Intake', 'Discovery', 'Closed', 'Archived'],
        default: 'Intake'
    },
    valueGrade: Number,
    mmProbability: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Case = mongoose.model('Case', caseSchema);
module.exports = Case;
