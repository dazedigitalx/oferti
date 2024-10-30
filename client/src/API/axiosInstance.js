import axios from 'axios';
import Cookies from 'js-cookie';

// Retrieve REACT_APP_API_URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'https://oferti-server.vercel.app'; // Fallback for local development

// Debugging line to ensure API_URL is set
console.log('API_URL:', API_URL); // Log API_URL for debugging

const axiosInstance = axios.create({
  baseURL: API_URL, // Using the variable from environment
});

// Request Interceptor to add authorization token to headers
axiosInstance.interceptors.request.use(
  (config) => {
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

// Response Interceptor for Error Handling and Token Refresh
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return the response if successful
  async (error) => {
    const originalRequest = error.config;

    // Check if error status is 401 (Unauthorized) and refresh token logic is applicable
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent endless retry loops

      try {
        // Attempt to refresh token
        const refreshToken = Cookies.get('refreshToken'); // Retrieve refresh token from cookies

        if (refreshToken) {
          // Call the refresh endpoint with the refresh token
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

          const newAccessToken = response.data.accessToken;

          // Store the new access token in localStorage or Cookies
          localStorage.setItem('accessToken', newAccessToken);
          Cookies.set('accessToken', newAccessToken);

          // Update the authorization header and retry the original request
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login page if token refresh fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
