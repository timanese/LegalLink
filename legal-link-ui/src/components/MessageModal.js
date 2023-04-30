import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import * as React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #2257bf",
  boxShadow: 24,
  p: 4,
};

export default function MessageModal(props) {
  const {
    isOpen,
    setIsOpen,
    setUpdateMessage,
    updateMessage,
    handleSendingMail,
  } = props;

  const handleInputChange = (event) => {
    setUpdateMessage(event.target.value);
  };

  const handleSubmit = () => {
    handleSendingMail();
    setIsOpen(false);
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ pb: 4 }}
          >
            Message Client
          </Typography>
          <TextField
            minRows={5}
            maxRows={10}
            multiline
            sx={{ width: "100%" }}
            value={updateMessage}
            onChange={handleInputChange}
          ></TextField>
          <Box
            sx={{
              display: "flex",

              justifyContent: "flex-end",
              pt: 4,
            }}
          >
            <Button variant="contained" onClick={() => handleSubmit()}>
              Send
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
