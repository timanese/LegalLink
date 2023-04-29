const Client = require('../models/Client');

// Register a new client
exports.register = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const client = new Client({ name, email, phone });
    await client.save();

    res.status(201).json({ message: 'User registered successfully', client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a client
exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Logged in successfully', client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


