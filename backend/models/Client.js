// models/Client.js

const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
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
    mail: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Mail',
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
