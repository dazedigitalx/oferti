// src/components/Win.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import WinComponent from './WinComponent'; // Import the WinComponent for the slot machinea
import './Win.css'; // Ensure you have the styles defined here
import './Common.css';

const Win = () => {
    const { user } = useAuth(); // User authentication context
    const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar visibility state (closed by default)
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
                    />
                </header>

                <div className="main-layout">
                    <main className="content-container">
                        {activeChannel ? (
                            <div className="content-content">
                                <div className="content-header">Top Oferti {activeChannel.name}</div>
                                {/* Load the WinComponent here for the slot machine interface */}
                                <WinComponent />
                            </div>
                        ) : (
                            <p>{noMessagesMessage}</p>
                        )}
                    </main>

                    <aside className="aside">
                        <p></p>
                    </aside>
                </div>

                {!isAuthenticated && (
                    <footer className="footer">
                        <p className="mb-2">You're not logged in. Log in to get the full experience.</p>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default Win; // Ensure you're using default export
