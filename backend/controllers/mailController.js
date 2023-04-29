const Mail = require('../models/Mail');
const { ObjectId } = require('mongodb');

// Send mail to a client regarding a case
exports.sendMail = async (req, res) => {
  try {
    const { caseId, clientId, title, description } = req.body;
    const newMail = new Mail({
      caseId: caseId,
      clientId: clientId,
      title: title,
      description: description,
    });
    console.log("CREATED");
    const savedMail = await newMail.save();
    res.status(201).json(savedMail);
  } catch (error) {
    res.status(400).json({ message: 'Error creating mail:', error });
  }
};

// Get all mail for a client
exports.getAllClientMail = async (req, res) => {
    try {
        const mail = await Mail.find({ clientId: req.params.id });
        res.status(200).json(mail);
    } catch (error) {
        res.status(404).json({ message: 'Error getting mail:', error });
    }
};

// Get all mail for a case
exports.getAllCaseMail = async (req, res) => {
    try {
        const mail = await Mail.find({ caseId: req.params.id });
        res.status(200).json(mail);
    } catch (error) {
        res.status(404).json({ message: 'Error getting mail:', error });
    }
};

// Get a mail by ID
exports.getMail = async (req, res) => {
    try {
        const mail = await Mail.findById(req.params.id);
        res.status(200).json(mail);
    } catch (error) {
        res.status(404).json({ message: 'Error getting mail:', error });
    }
};

// Delete a mail by ID
exports.deleteMail = async (req, res) => {
    try {
        const mail = await Mail.findByIdAndDelete(req.params.id);
        res.status(200).json(mail);
    } catch (error) {
        res.status(404).json({ message: 'Error deleting mail:', error });
    }
};
