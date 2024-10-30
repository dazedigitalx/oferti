import axios from 'axios';
import Cookies from 'js-cookie';

// Retrieve REACT_APP_API_URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'https://oferti-server.vercel.app'; // Fallback for local development

// Debugging line to ensure API_URL is set
console.log('API_URL:', API_URL); // Log API_URL for debugging

const axiosInstance = axios.create({
  baseURL: API_URL, // Using the variable from environment
});

// Interceptor to add authorization token to request headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage or Cookies
    const token = localStorage.getItem('accessToken') || Cookies.get('accessToken');

    // Add the token to headers if it exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Token:', token); // Log token for debugging
    } else {
      console.warn('No token found, skipping authorization for this request.');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
