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

    const generatedCaseDescription = `For the following legal case, prrovide a more in depth yet understandable description of the initial claim provided that describes it in a legal case sense.  This should include the facts of the case, the legal issues, and the legal arguments.  Please only provide the description and nothing else. If you feel that there was not enough information provided, never respond with unfortunately as an AI model sequence, instead say 'Not enough information provided'. Initial Claim: '${caseDescription}'`;

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


async function reevaluateCase(originalCase, newInformation) {

  console.log("In ReEvaluate Case");
  console.log(originalCase);
  console.log(newInformation);

  const reevaluationPrompt = `Provided a case that has already been graded and text from documents just submitted, reevaluate the case metrics
  this involves update the grade, grade explanation, green flags, red flags, and MNM probability score based on the new information provided,
  if you feel that there is not enough information provided, never respond with unfortunately as an AI model sequence, instead respond with the original case information.
  If you feel that the case should not be reevaluated for any reason, respond with the original case information.
  It is imperative that you do not deviate from the structure provided from the original case information, as this will cause the reevaluation to fail.
  Remember that you are building off of the original case information, not starting from scratch. Your new metrics, should you choose to reevaluate the case,
  should reflect the new information provided on top of the original case information.  Please only provide the new metrics and nothing else.
  Original Case Information: '${originalCase}'`;

  try {
    const reevaluationMessages = [
      {
        role: "user",
        content: reevaluationPrompt,
      },
    ];

    const reevaluationResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: reevaluationMessages,
      temperature: 0.3,
    });

    const reevaluationExplanationPrompt = `Using this new case evaluation '${reevaluationResponse.data.choices[0].message.content.trim()}',
    please explain the evaluation that was provided based on the new information provided and remember to include the original case information as well.'`;

    const reevaluationExplanationMessages = [
      {
        role: "user",
        content: reevaluationExplanationPrompt,
      },
    ];

    const reevaluationExplanationResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: reevaluationExplanationMessages,
      temperature: 0.1,
    });

    const gradePrompt = `Based on the original case provided, and the new information, please grade the following legal case on a scale from 1 to 10, where 1 signifies the least likelihood of winning a court case or receiving a small settlement, and 10 represents the highest likelihood of winning a court case and obtaining a very large settlement.

Original Case: '${originalCase}'
New Information: '${newInformation}'

For reference:
- A Grade 1 case example: 'A person is suing their neighbor over the color of their mailbox.'
- A Grade 10 case example: 'A person is suing a large corporation for causing irreversible environmental damage, resulting in the loss of their livelihood and severe health issues.'
Please only give the grade without an explanation
If there is not enough infrormation to provide an accurate grade then just give the original grade and nothing else`;

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
    please explain the grade that was provided for the case reevaluation after reviewing the original case and the new information as if you are a lawyer on a scale from 1 to 10, 
    where 1 signifies the least likelihood of winning a court case or receiving a small settlement, 
    and 10 represents the highest likelihood of winning a court case and obtaining a very large settlement.

    Original Case: '${originalCase}'
    New Information: '${newInformation}
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

    const greenFlagsPrompt = `For the original case, and the new information, provide a list of green flags (reasons why the case might win or have a larger settlement) only provide the list and nothing else for formatting, do not number or bullet the list:

    Original Case: '${originalCase}'
    New Information: '${newInformation}'`;

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

    const redFlagsPrompt = `For the original case, and new information, provide a list of red flags (reasons why the case might lose or have a small settlement) only provide the list and nothing else for format, do not number or bullet the list:
    Original Case: '${originalCase}'
    New Information: '${newInformation}'`;

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

    const MNMProbabilityPrompt = `For the original case, and new infromation provide a probability score (0-100) of how confident you are that the law firm Morgan & Morgan SHOULD take on this case.  This should account for the likelihood of winning the case, the likelihood of a large settlement, and the likelihood of the client being able to pay the firm's fees.  Please only provide the probability score and nothing else. If you feel that you do not have enough information, provide the original MNMProbability score and nothing else, never provide anything but a number that fits the constraints. If you provide anything that is not a number it will break and ruin this reevaluation. Original Case: '${originalCase}'
    New Information: '${newInformation}'
    Some example outputs include:
    0
    11
    23
    32 
    41
    54
    65
    76
    83
    94
    10
    These are possible outputs, nothing greater than 100 or less than 0 should be provided
    and there should be no other text in the response other than the number`;

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

    const generatedCaseDescription = `For the original case, and new information, prrovide a more in depth yet understandable description of the initial claim provided that describes it in a legal case sense.  This should include the facts of the case, the legal issues, and the legal arguments.  Please only provide the description and nothing else. If you feel that there was not enough information provided, never respond with unfortunately as an AI model sequence, instead say 'Not enough information provided'. Initial Claim:    Original Case: '${originalCase}'
    New Information: '${newInformation}'`;

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
      reevaluateCase: reevaluationResponse.data.choices[0].message.content.trim(),
      reevaluationExplanation: reevaluationExplanationResponse.data.choices[0].message.content.trim(),
    };
  } catch (error) {
    console.log("Error generating text:", error);
  }
}

module.exports = {
  generateText,
  reevaluateCase,
};
