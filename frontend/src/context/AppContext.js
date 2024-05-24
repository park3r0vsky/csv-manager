import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { FILE_LIST_API_URL } from "../constants";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(FILE_LIST_API_URL);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <AppContext.Provider value={{ files, fetchFiles }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
