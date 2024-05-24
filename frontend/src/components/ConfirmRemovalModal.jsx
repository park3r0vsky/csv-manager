import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { FILES_API_URL } from "../constants";

const ConfirmRemovalModal = ({ fileId }) => {
  const [open, setOpen] = useState(false);
  const { fetchFiles } = useContext(AppContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onConfirm = async () => {
    try {
      await axios.delete(FILES_API_URL, { data: { id: fileId } });
      fetchFiles();
      handleClose();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <>
      <Button variant="contained" color="error" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirm} color="secondary">
            Yes
          </Button>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmRemovalModal;
