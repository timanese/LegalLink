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

  return (
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
  );
}

export default InputAndUpload;
