import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import axios from "axios";
import * as React from "react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import FileUploadManager from "./FileUploadManager";

function InputAndUpload({ onSendMessage }) {
  const [message, setMessage] = React.useState("");
  const [files, setFiles] = React.useState([]);
  const [text, setText] = useState("");
  const [rows, setRows] = useState(1);
  const [created, setCreated] = useState(true);
  const MAX_ROWS = 5;

  const { clientId } = useContext(AuthContext);

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

  // const handleFileChange = (event) => {
  //   setFiles([...event.target.files]);
  // };

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

  const createCase = () => {
    setCreated(false);
    // Create form data object to send files and metadata to the server
    const formData = new FormData();

    const fileIds = [];

    // Add files to form data object
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i].file);
    }

    // Upload the files to the server
    axios
      .post("http://localhost:3001/api/cases/uploadFile", formData)
      .then((res) => {
        // Iterate over each file response that was uploaded to the server
        // Add each id to the fileIds array
        for (let i = 0; i < res.data.files.length; i++) {
          console.log("File " + i + " ID: ", res.data.files[i].id);
          fileIds.push(res.data.files[i].id);
        }

        // Case description
        axios
          .post("http://localhost:3001/api/cases/create", {
            clientID: clientId,
            initialClaim: text,
            fileIds: fileIds,
          })
          .then((res) => {
            console.log(res.data);
            // Clear all the fields
            setText("");
            setFiles([]);
            setCreated(true);

            // Reload the case list
          })
          .catch((err) => {
            console.log(err);
            setCreated(true);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    // For each file, convert to plain text based on its file type
    // Store the plain text in an array, this will later be used to feed the model
    // to generate a grade for the case
    const plainTextList = [];
    axios
      .post("http://localhost:3001/api/cases/getFileAsPlainText", formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log("FOUND ERROR: " + err);
      });
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
            rows={5}
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
          <Button
            variant="contained"
            onClick={() => createCase()}
            sx={{ m: 1 }}
            disabled={!created}
          >
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
      {/* File Upload */}
      {files.length > 0 && (
        <Box sx={{ width: "90%", overflow: "auto", maxHeight: 150 }}>
          <FileUploadManager
            files={files}
            handleDeleteFile={handleDeleteFile}
          />
        </Box>
      )}
      {created ? (
        <></>
      ) : (
        <Box sx={{ width: "90%", pt: 2 }}>
          <LinearProgress />
        </Box>
      )}
    </div>
  );
}

export default InputAndUpload;
