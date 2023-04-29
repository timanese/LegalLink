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
        enum: ['Intake', 'Discovery', 'Closed'],
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
