import InboxIcon from "@mui/icons-material/Inbox";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DownloadIcon from '@mui/icons-material/Download';
import { blue } from '@mui/material/colors';
import axios from "axios";
import { Buffer } from 'buffer';

import * as React from "react";

export default function FileList(props) {
  const { files } = props;

  // const handleDownload = async (file) => {
  //   const response = await axios.get(
  //     `http://localhost:3001/api/cases/downloadFile/${file._id}/${file.filename}`
  //   );

  //   console.log(response);
  //   // Convert the hex string to a buffer
  //   const buffer = Buffer.from(response.data.fileContents.data, "hex");
  //   // Convert the buffer to a Blob object
  //   const blob = new Blob([buffer], { type: "application/octet-stream" });
  //   // Create a link element
  //   const a = document.createElement("a");
  //   // Set the href attribute of the link element to the URL for the Blob
  //   a.href = URL.createObjectURL(blob);
  //   // Set the download attribute of the link element
  //   a.download = file.filename;
  //   // Append the link element to the document
  //   document.body.appendChild(a);
  //   // Click the link element to initiate the download
  //   a.click();
  //   // Remove the link element from the document
  //   document.body.removeChild(a);
  // };


//   const handleDownload = async (file) => {
//   try {
//     const response = await axios.get(
//       `http://localhost:3001/api/cases/downloadFile/${file._id}/${file.filename}`,
//       { responseType: 'arraybuffer' }
//     );
//     // Convert the response to a Blob object
//     const blob = new Blob([response.data], { type: "application/octet-stream" });
//     // Create a link element
//     const a = document.createElement("a");
//     // Set the href attribute of the link element to the URL for the Blob
//     a.href = URL.createObjectURL(blob);
//     // Set the download attribute of the link element
//     a.download = file.filename;
//     // Append the link element to the document
//     document.body.appendChild(a);
//     // Click the link element to initiate the download
//     a.click();
//     // Remove the link element from the document
//     document.body.removeChild(a);
//   } catch (error) {
//     console.error('Download error:', error);
//   }
// };

const handleDownload = async (file) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/cases/downloadFile/${file._id}/${file.filename}`,
      { responseType: 'blob' }
    );
    // Use the received Blob object
    const blob = response.data;
    // Create a link element
    const a = document.createElement("a");
    // Set the href attribute of the link element to the URL for the Blob
    a.href = URL.createObjectURL(blob);
    // Set the download attribute of the link element
    a.download = file.filename;
    // Append the link element to the document
    document.body.appendChild(a);
    // Click the link element to initiate the download
    a.click();
    // Remove the link element from the document
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
  }
};




  return (
    <Box sx={{ height: "100%", width: "100%", bgcolor: "background.paper" }}>
      {files.length === 0 ? (
        <Box>
          <Typography color={"grey.700"}>No files to download</Typography>
        </Box>
      ) : (
        <nav aria-label="file list">
          <List sx={{ width: "100%" }}>
            {files.map((file) => (
              <ListItem disablePadding key={file._id}>
                <ListItemButton 
                  component="a" 
                  // href={file.filename} 
                  target="_blank"
                  onClick={() => handleDownload(file)}
                  >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={file.filename} />
                  <ListItemIcon>
                    <DownloadIcon 
                     sx={{
                        '&:hover': {
                          color: blue[500],
                        },
                      }}/>
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </nav>
      )}
    </Box>
  );
}
