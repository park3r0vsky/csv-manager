const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const FILES_API_URL = `${API_URL}/api/file`;
const FILE_LIST_API_URL = `${API_URL}/api/file/list`;
const FILE_PREVIEW_API_URL = `${API_URL}/api/file/preview`;
const FILE_ENRICH_API_URL = `${API_URL}/api/file/enrich`;
const FILE_COLUMNS_API_URL = `${API_URL}/api/file/columns`;

export {
  FILES_API_URL,
  FILE_LIST_API_URL,
  FILE_PREVIEW_API_URL,
  FILE_ENRICH_API_URL,
  FILE_COLUMNS_API_URL,
};
