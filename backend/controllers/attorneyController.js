const Attorney = require('../models/Attorney');

// Register a new client
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all information is provided
    if (!name || !email || !password) {
      return res.error(400).json({ message: 'Please provide all necessary information' });
    }

    // Check if the user already exists
    const existingAttorney = await Attorney.findOne({ email });
    if (existingAttorney) {
      return res.error(400).json({ message: 'Attorney account already exists' });
    }

    // Create a new client
    const attorney = new Attorney({ name, email, password });
    await attorney.save();

    res.status(201).json({ message: 'User registered successfully', attorney });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a client
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const attorney = await Attorney.findOne({ email });
    if (!attorney) {
      return res.status(400).json({ message: 'Attorney not found' });
    }

    // Check if the submitted password matches the one in the database
    if (attorney.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Logged in successfully', attorney });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


