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
} from "@mui/material";
import ConfirmRemovalModal from "./ConfirmRemovalModal";
import PreviewTable from "./PreviewTable";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { FILE_PREVIEW_API_URL, FILE_ENRICH_API_URL } from "../constants";

const ListFiles = ({ files }) => {
  const { fetchFiles } = useContext(AppContext);
  const [previewData, setPreviewData] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const previewFile = async (fileId) => {
    try {
      const response = await axios.get(`${FILE_PREVIEW_API_URL}/${fileId}`);
      setPreviewData(response.data);
      setPreviewOpen(true);
    } catch (error) {
      console.error("Error previewing file:", error);
    }
  };

  const enrichFile = async (fileId) => {
    const enrichUrl = prompt("Enter the API endpoint for enrichment:");
    const joinColumn = prompt("Enter the key column name from data file:");
    const apiKeyColumn = prompt("Enter the key name for API response:");

    try {
      await axios.post(`${FILE_ENRICH_API_URL}/${fileId}`, {
        enrich_url: enrichUrl,
        join_column: joinColumn,
        api_key_column: apiKeyColumn,
      });
      fetchFiles();
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
                        onClick={() => enrichFile(file.id)}
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
    </>
  );
};

export default ListFiles;
