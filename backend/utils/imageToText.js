// utils/imageToText.js
const fs = require("fs");
const {
  ComputerVisionClient,
} = require("@azure/cognitiveservices-computervision");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");
const dotenv = require("dotenv");

dotenv.config();

const cognitiveServicesCredentials = new CognitiveServicesCredentials(
  process.env.AZURE_COMPUTER_VISION_API_KEY
);

const computerVisionClient = new ComputerVisionClient(
  cognitiveServicesCredentials,
  process.env.AZURE_COMPUTER_VISION_ENDPOINT
);

async function getImageDescription(imagePath) {
  try {
    const imageFileStream = fs.createReadStream(imagePath);
    const options = {
      visualFeatures: ["Description"],
      language: "en",
    };

    const descriptionResult = await computerVisionClient.analyzeImageInStream(
      () => imageFileStream,
      options
    );

    if (
      descriptionResult &&
      descriptionResult.description.captions.length > 0
    ) {
      return descriptionResult.description.captions[0].text;
    } else {
      return "No description available";
    }
  } catch (error) {
    console.error("Error getting image description:", error);
    return null;
  }
}

module.exports = {
  getImageDescription,
};
