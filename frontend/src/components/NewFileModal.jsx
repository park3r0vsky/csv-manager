import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { FILES_API_URL } from "../constants";

const NewFileModal = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const { fetchFiles } = useContext(AppContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setError(null);
  };

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Only CSV files are allowed.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a valid CSV file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(FILES_API_URL, formData);
      fetchFiles();
      handleClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file.");
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
          <DialogContentText>
            Please select a CSV file to upload.
          </DialogContentText>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={onSubmit}>
            <TextField
              margin="dense"
              id="file"
              type="file"
              fullWidth
              onChange={onFileChange}
              InputLabelProps={{
                shrink: true,
              }}
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
