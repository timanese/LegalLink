import React from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

const MessageList = ({ messages }) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 360, overflow: "auto" }}>
      <List>
        {messages.map((message) => (
          <ListItem key={message.id} alignItems="flex-start">
            <ListItemText
              primary={message.title}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {message.sender}
                  </Typography>
                  {` — ${message.description}`}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MessageList;
