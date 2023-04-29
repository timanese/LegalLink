const Case = require('../models/Case');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const MongoClient = require('mongodb').MongoClient;
const GridFSBucket = require('mongodb').GridFSBucket;
const dotenv = require('dotenv');

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
    console.log('Connected to MongoDB');
  }
});

// Establish the database
const database = client.db('LegalLink');

const bucket = new GridFSBucket(database, { bucketName: 'files' });

const fileStorage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    // Extract the file information from the originalname string
    const filename = 'test';

    return new Promise((resolve, reject) => {
      const fileInfo = {
        filename: filename,
        bucketName: 'files',
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage: fileStorage });

exports.uploadFile = (req, res) => {
  upload.array('files')(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error uploading files' });
    }
    console.log(req.files);
    res.status(200).send({ message: 'File uploaded' });
  });
};

exports.createCase = async (req, res) => {
    try {
        const newCase = await Case.create(req.body);
        res.status(201).json({
        status: 'success',
        data: {
            case: newCase,
        },
        });
    } catch (err) {
        res.status(400).json({
        status: 'fail',
        message: err,
        });
    }
};