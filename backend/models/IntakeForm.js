// models/IntakeForm.js

const mongoose = require('mongoose');

const intakeFormSchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    answers: [
        {
            question: String,
            answer: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const IntakeForm = mongoose.model('IntakeForm', intakeFormSchema);
module.exports
