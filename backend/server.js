// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { getImageDescription } = require("./utils/imageToText.js");
const { generateText } = require("./utils/gpt");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Connect to OpenAI
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Define API routes
const caseRoutes = require("./routes/caseRoutes");
const clientRoutes = require("./routes/clientRoutes");
const attorneyRoutes = require("./routes/attorneyRoutes");
const intakeFormRoutes = require("./routes/intakeFormRoutes");
const mailRoutes = require("./routes/mailRoutes");

app.use("/api/cases", caseRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/attorneys", attorneyRoutes);
app.use("/api/intake-forms", intakeFormRoutes);
app.use("/api/mail", mailRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
});
