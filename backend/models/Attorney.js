// models/Attorney.js

const mongoose = require('mongoose');

const attorneySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Attorney = mongoose.model('Attorney', attorneySchema);
module.exports = Attorney;
