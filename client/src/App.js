import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword'; // Import the ResetPassword component
import PrivateRoute from './routes/PrivateRoute';
import Win from './components/Win'; // Import the Win component

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };

    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Navigate to="/win" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
                        <Route path="/win" element={<PrivateRoute element={<Win />} />} /> {/* Add the Win route */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
