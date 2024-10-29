// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axiosInstance from './API/axiosInstance';

// Log environment variables for debugging
console.log('Using environment:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('CLIENT_URL:', process.env.CLIENT_URL); // Example for additional API URLs
console.log('API_URL:', process.env.API_URL); // Example for additional API URLs


// Create the root element for rendering
const root = createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App axiosInstance={axiosInstance} />
    </AuthProvider>
  </React.StrictMode>
);

// Report web vitals
reportWebVitals();
