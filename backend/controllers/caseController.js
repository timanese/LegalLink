const Case = require("../models/Case");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const {ObjectId}  = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const dotenv = require("dotenv");
const { generateText } = require("../utils/gpt.js");

const fs = require("fs").promises;
const path = require("path");
const OfficeConverter = require("office-converter");
const converter = new OfficeConverter();
const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;
const { processFile } = require("../utils/fileUtils");
const Client = require("../models/Client");

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
const database = client.db("test");

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
    res.status(200).send({ message: "File uploaded", files: req.files });
  });
};

exports.pushFile = async (req, res) => {
  try {
    const { body } = req;
    const caseID = req.params.caseID;
    const fileIds = body.fileIds; // Assuming fileIds is an array of fileId strings

    // Add 'await' to the function call and use $each modifier
    const updatedCase = await Case.findByIdAndUpdate(
      new ObjectId(caseID),
      {
        $push: { fileIds: { $each: fileIds } },
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      status: "success",
      data: {
        case: updatedCase,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Create a new case
exports.createCase = async (req, res) => {
  try {
    const body = req.body;
    const text = await generateText(body.initialClaim);
    const grade = text.gradeValue;
    const gradeExplanation = text.gradeExplanation;
    const greenFlags = text.greenFlags.replaceAll("- ", "").split("\n");
    const redFlags = text.redFlags.replaceAll("- ", "").split("\n");
    const MNMProbability = text.MNMProbability;
    const generatedCaseDescription = text.generatedCaseDescription;

    const client = await Client.findById(new ObjectId(req.body.clientID));
    body.clientName = client.name;
    console.log(client);

    console.log(text);
    console.log(grade);
    body.valueGrade = parseInt(grade);
    body.gradeExplanation = gradeExplanation;
    body.greenFlags = greenFlags;
    body.redFlags = redFlags;
    body.MNMProbability = parseInt(MNMProbability);

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

exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.find({});
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


/////////////////////////////
// FILE HANDLING           //
/////////////////////////////

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./"); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Set the file name to be saved
  },
});

const uploadFiles = multer({ storage: storage });

exports.getFileAsPlainText = async (req, res) => {
  var plainTextList = [];

  uploadFiles.array("files")(req, res, async (err) => {
    if (err) {
      res.status(400).send("Error processing files: " + err.message);
      return;
    }
    const files = req.files;
    console.log(files);
    const processingPromises = files.map(async (file) => {
      return await processFile(file);
    });

    plainTextList = await Promise.all(processingPromises);
    res.json({ plainTextList });
  });
};


// Files collection
const files = database.collection("files.files");

// Get file by ID from MongoDB
exports.getFile = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const file = await files.find({ _id: new ObjectId(id) }).next();
    console.log(file);
    res.status(200).json({
      status: "success",
      data: {
        file,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Download file by ID from MongoDB
exports.downloadFile = async (req, res) => {
  try {
    const file_id = req.params.id;
    const chunks = [];

    const file = await files.find({ _id: new ObjectId(file_id) }).next();
    const encoding = file.contentType;
    console.log("FILE: " + file.contentType);
    const fileContents = await new Promise((resolve, reject) => {
      bucket.openDownloadStream(new ObjectId(file_id))
        .on('data', (chunk) => {
          chunks.push(chunk);
        })
        .on('error', (error) => {
          reject(error);
        })
        .on('end', () => {
          resolve(Buffer.concat(chunks));
        });
    });

    res.set('Content-Type', encoding);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.status(200).send(fileContents);
    // res.set('Content-Type', 'application/octet-stream');
    // res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    // res.status(200).send(fileContents.toString('binary'));

  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// // Function to get a single file from the files collection by id and return the file
// async function getFile(req, callback) {
//   const file_id = req.query.file_id;
//   const chunks = [];

//   const file = await bucket.find({ _id: ObjectId(file_id) }).next();
//   const encoding = file.contentType;

//   bucket.openDownloadStream(ObjectId(file_id)).on('data', (chunk) => {
//     chunks.push(chunk);
//   }).on('error', (error) => {
//     return callback(error);
//   }).on('end', async() => {
//     const fileContents = Buffer.concat(chunks);
//     return callback(null, fileContents, encoding);
//   });
// }