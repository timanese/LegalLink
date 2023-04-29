// Import environment variables
require('dotenv').config();

// Establish express app and middleware
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const openai = require('openai');

// Host port 3001
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    });

