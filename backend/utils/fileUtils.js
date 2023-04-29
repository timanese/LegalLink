const fs = require("fs");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

async function readDocxFile(docxFilePath) {
  const result = await mammoth.extractRawText({ path: docxFilePath });
  return result.value;
}

async function readPdfFile(pdfFilePath) {
  const pdfBuffer = fs.readFileSync(pdfFilePath);
  const pdfData = await pdfParse(pdfBuffer);
  return pdfData.text;
}

async function processFile(file) {
  let fullText;

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    fullText = await readDocxFile(file.path);
  } else if (file.mimetype === "application/pdf") {
    fullText = await readPdfFile(file.path);
  } else {
    console.error("Unsupported file type");
    return null;
  }
  console.log(fullText);

  return fullText;
}

module.exports = {
  processFile,
};
