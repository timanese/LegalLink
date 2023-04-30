import React from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

const MessageList = ({ messages }) => {
  const sortedMessages = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <Box sx={{ width: "100%", maxWidth: 360, overflow: "auto" }}>
      <List>
        {messages === undefined ? (
          <Typography
            sx={{ display: "inline" }}
            component="span"
            variant="body2"
            color="text.primary"
          >
            Nothing to do currently!
          </Typography>
        ) : (
          sortedMessages.map((message) => (
            <ListItem key={message._id} alignItems="flex-start">
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
          ))
        )}
      </List>
    </Box>
  );
};

export default MessageList;
