const fs = require("fs");
// Load the JSON file
const prompts = require("./train.json");

// Define the strings to prepend and append
const prefix = "Grade the following legal case based on its description: '";
const suffix =
  "'. Provide a grade from 1 to 10, 1 being least likely to win a settlement in court, and 10 being very likely to win a large settlement in court.";

// Loop through each prompt in the array of objects
for (let i = 0; i < prompts.length; i++) {
  const prompt = prompts[i].prompt;
  const completion = prompts[i].completion;

  // Prepend and append the strings
  const modifiedPrompt = prefix + prompt + suffix;

  // Log the modified prompt and completion
  prompts[i].prompt = modifiedPrompt;
  console.log("Modified prompt:", modifiedPrompt);
}

// Write the updated JSON object back to the file
fs.writeFileSync("./train.json", JSON.stringify(prompts));

console.log("JSON file updated successfully!");
