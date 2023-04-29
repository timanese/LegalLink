import ClearIcon from "@mui/icons-material/Clear";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useState } from "react";

function InputAndUpload({ onSendMessage }) {
  const [message, setMessage] = React.useState("");
  const [files, setFiles] = React.useState([]);
  const [text, setText] = useState("");
  const [rows, setRows] = useState(1);
  const MAX_ROWS = 5;

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

  const handleChange = (event) => {
    console.log(...event.target.files);
    event.preventDefault();

    const addFiles = [];

    for (let i = 0; i < event.target.files.length; i++) {
      const Attachment = {
        file: event.target.files[i],
      };
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
    <div style={{ height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          py: 2,
          width: "100%",
        }}
      >
        <Box sx={{ width: "90%" }}>
          <TextField
            label="Enter your description"
            multiline
            rows={rows}
            value={text}
            onChange={handleTextChange}
            sx={{
              flexGrow: 1,
              flexShrink: 0,
              width: "100%",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "10%",
            // backgroundColor: "blue",
            justifyContent: "center",
          }}
        >
          <Button variant="contained" onClick={handleSend} sx={{ m: 1 }}>
            Send
          </Button>
        </Box>
      </Box>
      <Box
        className="file-attachment"
        sx={{
          width: "90%",
          overflow: "auto",
          flexGrow: 1,
          flexShrink: 0,
          backgroundColor: "grey.200",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          borderRadius: 1,
          // backgroundColor: "yellow",
        }}
      >
        <file-attachment className="GitHubFileAttach" input="file" directory>
          <Box
            className="file-attachment-text"
            sx={{ color: "grey.700", marginBottom: 1 }}
          >
            Drag and drop folders/files or click here to select files.
          </Box>
          <input
            className="inputUploadFiles"
            type="file"
            onChange={handleChange}
            multiple
            sx={{ display: "none" }}
          />
        </file-attachment>
      </Box>
      {files.length > 0 && (
        <Box sx={{ width: "90%", overflow: "auto", maxHeight: 150 }}>
          <List>
            {files.map((file, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <ListItem>
                  <ListItemButton>
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText>
                      {file.fullPath != undefined
                        ? file.fullPath
                        : file.file.name}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
                <Button onClick={() => handleDeleteFile(i)} color="inherit">
                  <ClearIcon color="error" />
                </Button>
              </Box>
            ))}
          </List>
        </Box>
      )}
    </div>
  );
}

export default InputAndUpload;
