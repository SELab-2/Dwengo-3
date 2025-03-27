import axios from 'axios';

// TODO: Set the API_URL to the correct URL of the server
const API_URL = 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
