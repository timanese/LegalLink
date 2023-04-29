// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected!");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Define API routes
// const caseRoutes = require('./routes/caseRoutes');
// const clientRoutes = require('./routes/clientRoutes');
// const intakeFormRoutes = require('./routes/intakeFormRoutes');

// app.use('/api/cases', caseRoutes);
// app.use('/api/clients', clientRoutes);
// app.use('/api/intake-forms', intakeFormRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
