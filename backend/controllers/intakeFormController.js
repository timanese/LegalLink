const { getDocument } = require('pdfjs-dist');
const mammoth = require('mammoth');


exports.getFilesAsPlainTextController = async (req, res) => {
    const { fileIds } = req.body;
    const plainTextList = await getFilesAsPlainText(fileIds);
    res.json({ plainTextList });
};

async function getFilesAsPlainText(fileIds)
{
    



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





