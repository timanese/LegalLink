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
