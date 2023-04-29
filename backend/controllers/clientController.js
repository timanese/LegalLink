const Client = require('../models/Client');

// Register a new client
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all information is provided
    if (!name || !email || !password) {
      return res.error(400).json({ message: 'Please provide all necessary information' });
    }

    // Check if the user already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.error(400).json({ message: 'User already exists' });
    }

    // Create a new client
    const client = new Client({ name, email, password });
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
    const { email, password } = req.body;
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the submitted password matches the one in the database
    if (client.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Logged in successfully', client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


