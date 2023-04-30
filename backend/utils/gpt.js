// gpt.js

const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateText(caseDescription) {
  const gradePrompt = `Based on the description provided, please grade the following legal case on a scale from 1 to 10, where 1 signifies the least likelihood of winning a court case or receiving a small settlement, and 10 represents the highest likelihood of winning a court case and obtaining a very large settlement.

Case Description: '${caseDescription}'

For reference:
- A Grade 1 case example: 'A person is suing their neighbor over the color of their mailbox.'
- A Grade 10 case example: 'A person is suing a large corporation for causing irreversible environmental damage, resulting in the loss of their livelihood and severe health issues.'
Please only give the grade without an explanation`;

  try {
    const gradeMessages = [
      {
        role: "user",
        content: gradePrompt,
      },
    ];

    const gradeResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: gradeMessages,
      temperature: 0.1,
    });

    const gradeExplanationPrompt = `Using this grade '${gradeResponse.data.choices[0].message.content.trim()}',
    please explain the grade that was provided for the following legal case as if you are a lawyer on a scale from 1 to 10, 
    where 1 signifies the least likelihood of winning a court case or receiving a small settlement, 
    and 10 represents the highest likelihood of winning a court case and obtaining a very large settlement.

    Case Description: '${caseDescription}'
`;

    const gradeExplanationMessages = [
      {
        role: "user",
        content: gradeExplanationPrompt,
      },
    ];

    const gradeExplanationResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: gradeExplanationMessages,
      temperature: 0.1,
    });

    const greenFlagsPrompt = `For the following legal case, provide a list of green flags (reasons why the case might win or have a larger settlement) only provide the list and nothing else for formatting, do not number or bullet the list:

Case Description: '${caseDescription}'`;

    const greenFlagsMessages = [
      {
        role: "user",
        content: greenFlagsPrompt,
      },
    ];

    const greenFlagsResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: greenFlagsMessages,
      temperature: 0.1,
    });

    const redFlagsPrompt = `For the following legal case, provide a list of red flags (reasons why the case might lose or have a small settlement) only provide the list and nothing else for format, do not number or bullet the list:

Case Description: '${caseDescription}'`;

    const redFlagsMessages = [
      {
        role: "user",
        content: redFlagsPrompt,
      },
    ];

    const redFlagsResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: redFlagsMessages,
      temperature: 0.1,
    });

    const MNMProbabilityPrompt = `For the following legal case, provide a probability score (0-100) of how confident you are that the law firm Morgan & Morgan SHOULD take on this case.  This should account for the likelihood of winning the case, the likelihood of a large settlement, and the likelihood of the client being able to pay the firm's fees.  Please only provide the probability score and nothing else. Case Description: '${caseDescription}'`;

    const MNMProbabilityMessages = [
      {
        role: "user",
        content: MNMProbabilityPrompt,
      },
    ];

    const MNMProbabilityResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: MNMProbabilityMessages,
      temperature: 0.1,
    });

    const generatedCaseDescription = `For the following legal case, prrovide a more in depth yet understandable description of the case.  This should include the facts of the case, the legal issues, and the legal arguments.  Please only provide the description and nothing else. Case Description: '${caseDescription}'`;

    const generatedCaseDescriptionMessages = [
      {
        role: "user",
        content: generatedCaseDescription,
      },
    ];

    const generatedCaseDescriptionResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: generatedCaseDescriptionMessages,
      temperature: 0.4,
    });

    return {
      gradeValue: gradeResponse.data.choices[0].message.content.trim(),
      gradeExplanation:
        gradeExplanationResponse.data.choices[0].message.content.trim(),
      greenFlags: greenFlagsResponse.data.choices[0].message.content.trim(),
      redFlags: redFlagsResponse.data.choices[0].message.content.trim(),
      MNMProbability: MNMProbabilityResponse.data.choices[0].message.content.trim(),
      generatedCaseDescription: generatedCaseDescriptionResponse.data.choices[0].message.content.trim(),
    };
  } catch (error) {
    console.log("Error generating text:", error);
  }
}

module.exports = {
  generateText,
};
