import axios from 'axios';

// TODO: Set the API_URL to the correct URL of the server
const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials (cookies) in requests
});

export default apiClient;
