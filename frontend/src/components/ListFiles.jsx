import React, { useState, useContext } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import ConfirmRemovalModal from "./ConfirmRemovalModal";
import PreviewTable from "./PreviewTable";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  FILE_PREVIEW_API_URL,
  FILE_ENRICH_API_URL,
  FILE_COLUMNS_API_URL,
} from "../constants";

const ListFiles = ({ files }) => {
  const { fetchFiles } = useContext(AppContext);
  const [previewData, setPreviewData] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [enrichOpen, setEnrichOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [apiColumns, setApiColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedApiColumn, setSelectedApiColumn] = useState("");
  const [enrichUrl, setEnrichUrl] = useState("");
  const [fileId, setFileId] = useState(null);

  const previewFile = async (fileId) => {
    try {
      const response = await axios.get(`${FILE_PREVIEW_API_URL}/${fileId}`);
      setPreviewData(response.data);
      setPreviewOpen(true);
    } catch (error) {
      console.error("Error previewing file:", error);
    }
  };

  const fetchColumns = async (fileId) => {
    try {
      const response = await axios.get(`${FILE_COLUMNS_API_URL}/${fileId}`);
      const fetchedColumns = response.data;
      setColumns(fetchedColumns);
      if (fetchedColumns.length > 0) {
        setSelectedColumn(fetchedColumns[0]);
      }
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  const handleEnrich = async (fileId) => {
    setFileId(fileId);
    await fetchColumns(fileId);
    setEnrichOpen(true);
  };

  const fetchApiColumns = async () => {
    try {
      const response = await axios.get(enrichUrl);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const apiColumns = Object.keys(response.data[0]);
        setApiColumns(apiColumns);
        setSelectedApiColumn(apiColumns[0]);
      }
    } catch (error) {
      console.error("Error fetching API columns:", error);
    }
  };

  const handleSubmitEnrich = async () => {
    try {
      await axios.post(`${FILE_ENRICH_API_URL}/${fileId}`, {
        enrich_url: enrichUrl,
        join_column: selectedColumn,
        api_key_column: selectedApiColumn,
      });
      fetchFiles();
      setEnrichOpen(false);
    } catch (error) {
      console.error("Error enriching file:", error);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>File Name</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Upload Time</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Is Enriched</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.length > 0 ? (
              files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.file_name}</TableCell>
                  <TableCell>{file.upload_time}</TableCell>
                  <TableCell>{file.is_enriched ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => previewFile(file.id)}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleEnrich(file.id)}
                      >
                        Enrich
                      </Button>
                      <ConfirmRemovalModal fileId={file.id} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="4" align="center">
                  <b>No files available, try adding some.</b>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PreviewTable
        open={previewOpen}
        handleClose={() => setPreviewOpen(false)}
        data={previewData}
      />

      <Dialog
        open={enrichOpen}
        onClose={() => setEnrichOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enrich File</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="API URL"
            type="text"
            fullWidth
            value={enrichUrl}
            onChange={(e) => setEnrichUrl(e.target.value)}
            onBlur={fetchApiColumns}
          />
          <TextField
            margin="dense"
            select
            label="CSV Column"
            fullWidth
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            {columns.map((column) => (
              <MenuItem key={column} value={column}>
                {column}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            select
            label="API Column"
            fullWidth
            value={selectedApiColumn}
            onChange={(e) => setSelectedApiColumn(e.target.value)}
          >
            {apiColumns.map((column) => (
              <MenuItem key={column} value={column}>
                {column}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrichOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitEnrich} color="primary">
            Enrich
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListFiles;
