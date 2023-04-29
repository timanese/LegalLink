import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";

export default function FileList({ files }) {
  return (
    <Box sx={{ height: "100%", width: "100%", bgcolor: "background.paper" }}>
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
    </Box>
  );
}
