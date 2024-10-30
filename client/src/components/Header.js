import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have a context to get user info
import UserProfile from './UserProfile'; // Ensure this path is correct
import Nav from './Nav'; // Ensure this path is correct
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Header.css'; // Ensure you have your CSS file for styling

const Header = ({ isSidebarOpen, toggleSidebar, isAuthenticated }) => {
    const { user } = useAuth(); // Access user info from AuthContext

    return (
        <div className={`header-container ${isSidebarOpen ? 'collapsed' : 'expanded'}`}>
            <header className="header">
                {/* Sidebar toggle button rendering only if user is authenticated */}
                {isAuthenticated && (
                    <div className="header-button-container">
                        <button
                            onClick={toggleSidebar}
                            className={`sidebar-toggle-button`}
                        >
                            {isSidebarOpen ? '=' : '='}
                        </button>
                    </div>
                )}

                {/* Header title and UserProfile within the same container */}
                <div className="header-title-container">
                    {user ? (
                        <div className='UserProfile'>
                            <UserProfile />
                        </div>
                    ) : null} {/* Hide message if user is not authenticated */}
                </div>

                {/* Navbar positioned to the right of the header title container */}
                <nav className='navbar'>
                    {user ? (
                        <Nav />
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="auth-link">Login</Link>
                            <Link to="/signup" className="auth-link">Register</Link>
                        </div>
                    )}
                </nav>
            </header>
        </div>
    );
};

export default Header;
