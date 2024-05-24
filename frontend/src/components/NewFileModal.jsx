import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { FILES_API_URL } from "../constants";

const NewFileModal = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const { fetchFiles } = useContext(AppContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(FILES_API_URL, formData);
      fetchFiles();
      handleClose();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        className="my-3"
      >
        Add New File
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload New File</DialogTitle>
        <DialogContent>
          <DialogContentText>Please select a file to upload.</DialogContentText>
          <form onSubmit={onSubmit}>
            <TextField
              margin="dense"
              id="file"
              type="file"
              fullWidth
              onChange={onFileChange}
            />
            <Button color="primary" type="submit">
              Upload
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewFileModal;
