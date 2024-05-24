import React, { useContext } from "react";
import { Container, Typography, Box } from "@mui/material";
import { AppContext } from "../context/AppContext";
import ListFiles from "./ListFiles";
import NewFileModal from "./NewFileModal";

const Home = () => {
  const { files } = useContext(AppContext);

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          📁File Manager
        </Typography>
        <NewFileModal />
        <ListFiles files={files} />
      </Box>
    </Container>
  );
};

export default Home;
