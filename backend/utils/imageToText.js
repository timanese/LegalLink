// utils/imageToText.js

const { ComputerVisionClient } = require('@azure/cognitiveservices-computervision');
const { CognitiveServicesCredentials } = require( '@azure/ms-rest-azure-js' );
const dotenv = require( 'dotenv' );

dotenv.config();

const cognitiveServicesCredentials = new CognitiveServicesCredentials(
  process.env.AZURE_COMPUTER_VISION_API_KEY
);

const computerVisionClient = new ComputerVisionClient(
  cognitiveServicesCredentials,
  process.env.AZURE_COMPUTER_VISION_ENDPOINT
);

async function getImageDescription(imageUrl) {
  try {
    const options = {
      maxCandidates: 1,
      language: 'en',
    };

    const descriptionResult = await computerVisionClient.describeImage(imageUrl, options);

    if (descriptionResult && descriptionResult.captions.length > 0) {
      return descriptionResult.captions[0].text;
    } else {
      return 'No description available';
    }
  } catch (error) {
    console.error('Error getting image description:', error);
    return null;
  }
}

module.exports = {
  getImageDescription,
};
