import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useState } from "react";

function InputAndUpload({ onSendMessage }) {
  const [message, setMessage] = React.useState("");
  const [files, setFiles] = React.useState([]);
  const [text, setText] = useState("");
  const [rows, setRows] = useState(1);
  const MAX_ROWS = 10;

  const handleTextChange = (event) => {
    setText(event.target.value);
    // calculate the number of rows needed based on the length of the text
    if (rows < MAX_ROWS) setRows(Math.ceil(event.target.value.length / 200));
  };

  const handleSend = () => {
    onSendMessage({ message, files });
    setMessage("");
    setFiles([]);
  };

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleChange = event => {
    console.log(...event.target.files);
    event.preventDefault();

    const addFiles = [];

    for (let i = 0; i < event.target.files.length; i++) {
      const Attachment = {
        file: event.target.files[i],
      }
      addFiles.push(Attachment);
    }

    if (event.target.files.length === 0) {
      return;
    }
    console.log(addFiles);
    setFiles([...files, ...addFiles]);
  };

  const handleDeleteFile = (index) => {
    // remove the file at the given index from the uploadedFiles array
    const updatedFiles = files.filter((file, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <div>
    <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
      <TextField
        label="Enter your description"
        multiline
        rows={rows}
        value={text}
        onChange={handleTextChange}
        sx={{
          width: 1000,
          overflow: "auto",
          flexGrow: 1,
          flexShrink: 0,
        }}
      />
      <input
        type="file"
        id="upload-files"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label htmlFor="upload-files">
        <IconButton
          color="primary"
          aria-label="upload files"
          component="span"
          sx={{ mr: 1 }}
        >
          <AttachFileIcon />
        </IconButton>
      </label>
      <Button variant="contained" onClick={handleSend}>
        Send
      </Button>
    </Box>
    <Box
      className="file-attachment"
      sx={{
        width: 1000,
        overflow: 'auto',
        flexGrow: 1,
        flexShrink: 0,
        backgroundColor: 'grey.200',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        borderRadius: 1,
      }}
    >
      <file-attachment
        className="GitHubFileAttach"
        input="file"
        directory
      >
        <Box
          className="file-attachment-text"
          sx={{ color: 'grey.700', marginBottom: 1 }}
        >
          Drag and drop folders/files or click here to select files.
        </Box>
        <input
          className="inputUploadFiles"
          type="file"
          onChange={handleChange}
          multiple
          sx={{ display: 'none' }}
        />
      </file-attachment>
       {(files.length > 0) && (
              <div className='listUploadedFiles'>
                {files.map((file, i) => (
                  <div className="uploadedFile" key={i}>
                    <h1>
                      {(file.fullPath != undefined) ? file.fullPath : file.file.name}
                    </h1>
                    <button onClick={() => handleDeleteFile(i)}>
                        {/* <img src={deleteFile} alt="delete"/> */}
                    </button>
                  </div>
                ))}
              </div>
            )}
    </Box>
  </div>

  );
}

export default InputAndUpload;
