const { getDocument } = require('pdfjs-dist');
const mammoth = require('mammoth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


exports.getFilesAsPlainTextController = async (req, res) => {
    const { files } = req.body;
    console.log(req);
    const plainTextList = await getFilesAsPlainText(files);
    res.json({ plainTextList });
};

async function getFilesAsPlainText(file)
{
    // Given the list of files, return a list of plain text strings
    const plainTextList = "";

    // Isolate the file names ending to determine the file type using regex
    const fileType = file.originalname.split('.').pop();

    console.log(fileType);

    return plainTextList;
}


async function readPDF(file) {
  const pdf = await getDocument(file).promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(' ');
    fullText += text + '\n';
  }

  return fullText;
};

async function readDocx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function (event) {
      const arrayBuffer = event.target.result;
      const text = await mammoth.extractRawText({ arrayBuffer });
      resolve(text.value);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}





