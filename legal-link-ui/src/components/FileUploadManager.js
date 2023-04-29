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
import * as React from "react";

export default function FileUploadManager(props) {
  const { files, handleDeleteFile } = props;
  return (
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
                {file.fullPath !== undefined ? file.fullPath : file.file.name}
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <Button onClick={() => handleDeleteFile(i)} color="inherit">
            <ClearIcon color="error" />
          </Button>
        </Box>
      ))}
    </List>
  );
}
