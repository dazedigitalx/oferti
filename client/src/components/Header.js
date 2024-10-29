import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have a context to get user info
import UserProfile from './UserProfile'; // Ensure this path is correct
import Nav from './Nav'; // Ensure this path is correct
import './Header.css'; // Ensure you have your CSS file for styling

const Header = ({ isSidebarOpen, toggleSidebar, noMessagesMessage }) => {
    const { user } = useAuth(); // Access user info from AuthContext

    return (
        <div className={`header-container ${isSidebarOpen ? 'collapsed' : 'expanded'}`}>
            <header className="header">
                {/* Sidebar toggle button rendering */}
                <div className="header-button-container">
                    <button
                        onClick={toggleSidebar}
                        className={`sidebar-toggle-button`}
                    >
                        {isSidebarOpen ? '=' : '='}
                    </button>
                </div>

                {/* Header title and UserProfile within the same container */}
                <div className="header-title-container">
                    {/* Conditional rendering based on user authentication */}
                    {user ? (
                        <div className='UserProfile'>
                            {/* Render UserProfile component if user is logged in */}
                            <UserProfile />
                        </div>
                    ) : (
                        <p className="error">{noMessagesMessage}</p> // Display error message if user is not authenticated
                    )}
                </div>

                {/* Navbar positioned to the right of the header title container */}
                <nav className='navbar'>
                    <Nav /> {/* Add other header links as needed */}
                </nav>
            </header>
        </div>
    );
};

export default Header;
