// gpt.js

const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateText(caseDescription) {
  const prompt = `Based on the description provided, please grade the following legal case on a scale from 1 to 10, where 1 signifies the least likelihood of winning a court case or receiving a small settlement, and 10 represents the highest likelihood of winning a court case and obtaining a very large settlement.

Case Description: '${caseDescription}'

For reference:
- A Grade 1 case example: 'A person is suing their neighbor over the color of their mailbox.'
- A Grade 10 case example: 'A person is suing a large corporation for causing irreversible environmental damage, resulting in the loss of their livelihood and severe health issues.'
Please only give the grade without an explanation`;
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
