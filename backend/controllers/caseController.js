const Case = require("../models/Case");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const dotenv = require("dotenv");
const { generateText } = require("../utils/gpt.js");

dotenv.config();

// Connect to MongoDB Cluster
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to MongoDB");
  }
});

// Establish the database
const database = client.db("LegalLink");

const bucket = new GridFSBucket(database, { bucketName: "files" });

const fileStorage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    // Extract the file information from the originalname string
    const filename = file.originalname;

    return new Promise((resolve, reject) => {
      const fileInfo = {
        filename: filename,
        bucketName: "files",
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage: fileStorage });

exports.uploadFile = (req, res) => {
  upload.array("files")(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error uploading files" });
    }
    console.log(req.files);
    res.status(200).send({ message: "File uploaded" });
  });
};

// Create a new case
exports.createCase = async (req, res) => {
  try {
    const body = req.body;
    const grade = generateText(body.description);
    body.valueGrade = grade;
    const newCase = await Case.create(body);
    res.status(201).json({
      status: "success",
      data: {
        case: newCase,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Get all cases for a client
exports.getAllClientCases = async (req, res) => {
  try {
    const cases = await Case.find({ clientID: req.params.id });
    res.status(200).json({
      status: "success",
      results: cases.length,
      data: {
        cases,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Get a case by ID
exports.getCase = async (req, res) => {
  try {
    const getCase = await Case.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        getCase,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Accept case and move up a stage
exports.acceptCase = async (req, res) => {
  const statuses = ["Pre-Intake", "Intake", "Discovery", "Closed", "Archived"];
  try {
    // Identify the current status and the next status
    const currentCase = await Case.findById(req.params.id);
    const currentStatus = currentCase.status;
    const currentStatusIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[currentStatusIndex + 1];

    // Change the status to the next stage in the process
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, {
      status: nextStatus,
    });
    res.status(200).json({
      status: "success",
      data: {
        updatedCase,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Reject case and move to archived
exports.rejectCase = async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, {
      status: "Closed",
    });
    res.status(200).json({
      status: "success",
      data: {
        updatedCase,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Set the file name to be saved
  },
});

// const uploadFiles = multer({ storage: storage });
const uploadFiles = multer();

// Given a list of files, return a list of plain text strings
exports.getFileAsPlainText = async (req, res) => {

  var plainTextList = [];

  uploadFiles.array('files')(req, res, async (err) => {
    if (err) {
      res.status(400).send('Error processing files: ' + err.message);
      return;
    }

    const files = req.files;
    console.log(files);
    const processingPromises = files.map((file) => 
    {
      processFile(file);
      documentToPlainText(file);
    
    });
      const plainTextList = (await Promise.all(processingPromises)).flat();
    res.json({ plainTextList });
  });
};

const OfficeConverter = require('office-converter');
const converter = new OfficeConverter();
const fs = require('fs');
const path = require('path');

async function convertDocxToPdf(docxFilePath, outputPdfPath) {
  try {
    await converter.generatePdf(docxFilePath, outputPdfPath);
    console.log('Conversion successful! PDF saved at:', outputPdfPath);
    return outputPdfPath;
  } catch (error) {
    console.error('Conversion failed:', error);
    return null;
  }
}

async function processFile(file) {
  let pdfFilePath;

  if (file.mimetype !== 'application/pdf') {
    const outputPdfPath = path.join('path/to/output', `${file.filename}.pdf`);
    pdfFilePath = await convertDocxToPdf(file.path, outputPdfPath);
  } else {
    pdfFilePath = file.path;
  }

  if (pdfFilePath) {
    const plainText = await documentToPlainText(pdfFilePath);
    // Do something with the plain text
  } else {
    console.error('Failed to convert or process the file');
  }
}



/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = "lustrous-bonito-353500";
const location = "us"; // Format is 'us' or 'eu'
const processorId = "164bb6b240e87770"; // Create processor in Cloud Console
// const filePath = "./American Government_ Elections.pdf";

const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;

// Instantiates a client
// apiEndpoint regions available: eu-documentai.googleapis.com, us-documentai.googleapis.com (Required if using eu based processor)
const DPSclient = new DocumentProcessorServiceClient({
  apiEndpoint: "us-documentai.googleapis.com",
});

async function documentToPlainText(file) {
  console.log(file);

  // const validFile = await processFile(file);
  // The full resource name of the processor, e.g.:
  // projects/project-id/locations/location/processor/processor-id
  // You must create new processors in the Cloud Console first
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  // Use the file buffer directly
  const encodedImage = file.buffer.toString("base64");
  // const encodedImage = file;

  // Identiy the file type using regex
  const fileType = file.originalname.split(".").pop();

  console.log(fileType);

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: file.mimetype,
    },
    key: "71eff1f9a4b4e94de834be2aacdc00798fd168b8",
  };

  // Recognizes text entities in the PDF document
  const [result] = await DPSclient.processDocument(request);
  const { document } = result;

  // Get all of the document text as one big string
  const { text } = document;

  // Extract shards from the text field
  const getText = (textAnchor) => {
    if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
      return "";
    }

    // First shard in document doesn't have startIndex property
    const startIndex = textAnchor.textSegments[0].startIndex || 0;
    const endIndex = textAnchor.textSegments[0].endIndex;

    return text.substring(startIndex, endIndex);
  };

  var fullText = "";

  // Read the text recognition output from the processor
  console.log("The document contains the following paragraphs:");
  const [page1] = document.pages;
  const { paragraphs } = page1;

  for (const paragraph of paragraphs) {
    const paragraphText = getText(paragraph.layout.textAnchor);
    // console.log(`Paragraph text:\n${paragraphText}`);
    fullText += paragraphText;
  }
  console.log(fullText);
  return fullText;
}
