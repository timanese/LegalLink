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
  // Replace 'caseDescription' with the actual description you want to use
  const caseDescription =
    "'I rented an apartment that was infested with mold, which the landlord failed to disclose. As a result, I developed respiratory issues and had to seek medical treatment. The landlord has refused to address the mold problem or compensate me for my medical expenses.";

  const prompt = `Based on the description provided, please grade the following legal case on a scale from 1 to 10, where 1 signifies the least likelihood of winning a court case or receiving a small settlement, and 10 represents the highest likelihood of winning a court case and obtaining a very large settlement.

Case Description: '${caseDescription}'

For reference:
- A Grade 1 case example: 'A person is suing their neighbor over the color of their mailbox.'
- A Grade 10 case example: 'A person is suing a large corporation for causing irreversible environmental damage, resulting in the loss of their livelihood and severe health issues.'
Please only give the grade without an explanation`;

  const response = await generateText(prompt);
  console.log("AI response:", response);
});
