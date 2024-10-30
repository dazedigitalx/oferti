import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Sidebar from './Sidebar';
import Header from './Header';
import Chat from './Chat';
import './Dashboard.css';
import './Common.css';

const Dashboard = () => {
    const { user } = useAuth(); // User authentication context
    const navigate = useNavigate(); // Hook for navigation
    const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar visibility state
    const [activeChannel, setActiveChannel] = useState(null); // Active chat channel
    const noMessagesMessage = "No messages available."; // Message for no chat

    // Load the last used channel from localStorage if the user is authenticated
    useEffect(() => {
        if (user) {
            const lastChannelId = localStorage.getItem('lastUsedChannelId');
            if (lastChannelId) {
                setActiveChannel({ _id: lastChannelId }); // Set last used channel as active
            }
        }
    }, [user]);

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setSidebarOpen((prevState) => !prevState);
    };

    // Handle channel selection
    const handleChannelSelect = (channel) => {
        setActiveChannel(channel); // Set selected channel as active
        localStorage.setItem('lastUsedChannelId', channel._id); // Save last used channel ID

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    // Handle window resizing
    const handleResize = () => {
        setSidebarOpen(window.innerWidth > 768); // Adjust sidebar based on window width
    };

    // Adding and cleaning up event listener for window resize
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isAuthenticated = !!user; // Check if user is authenticated

    return (
        <div className="main-content">
            {/* Check if the user is authenticated */}
            {isAuthenticated ? (
                <>
                    {/* Sidebar */}
                    <div className={`sidebar-container ${isSidebarOpen ? '' : 'closed'}`}>
                        <Sidebar
                            isSidebarOpen={isSidebarOpen}
                            toggleSidebar={toggleSidebar}
                            onChannelSelect={handleChannelSelect}
                        />
                    </div>

                    {/* Main content area */}
                    <div className={`content-area ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
                        <header className="header">
                            <Header
                                isSidebarOpen={isSidebarOpen}
                                toggleSidebar={toggleSidebar}
                                noMessagesMessage={noMessagesMessage}
                                isAuthenticated={isAuthenticated} // Pass authentication status
                            />
                        </header>

                        <div className="main-layout">
                            <main className="chat-container">
                                {activeChannel ? (
                                    <div className="chat-content">
                                        <div className="chat-header">Chat Header: {activeChannel.name}</div>
                                        <Chat channel={activeChannel} />
                                    </div>
                                ) : (
                                    <p>{noMessagesMessage}</p>
                                )}
                            </main>

                            <aside className="aside">
                                <p>Aside: Additional widgets or information can go here.</p>
                            </aside>
                        </div>
                    </div>
                </>
            ) : (
                // Show Login and Register buttons if not authenticated
                <div className="auth-buttons">
                    <h2>Please log in to access your dashboard</h2>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/signup')}>Register</button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
