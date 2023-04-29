// gpt.js

const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateText(prompt) {
  try {
    const messages = [
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.1,
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.log("Error generating text:", error);
  }
}

module.exports = {
  generateText,
};
