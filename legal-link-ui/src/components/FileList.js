import InboxIcon from "@mui/icons-material/Inbox";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

export default function FileList(props) {
  const { files } = props;
  console.log("FILES", files);
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
              <ListItem disablePadding key={file.id}>
                <ListItemButton component="a" href={file.url} target="_blank">
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={file.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </nav>
      )}
    </Box>
  );
}
