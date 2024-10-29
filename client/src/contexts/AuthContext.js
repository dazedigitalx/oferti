import React, { useEffect, useState, createContext, useContext } from 'react';
import axiosInstance from '../API/axiosInstance';
import Cookies from 'js-cookie';
import { generateGuestID } from '../utils'; // Ensure this utility is correctly implemented

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // For authenticated users
    const [guestId, setGuestId] = useState(null); // For guests
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to log out the user
    const logout = () => {
        setUser(null); // Clear the user state
        localStorage.removeItem('accessToken'); // Remove token from localStorage
        Cookies.remove('accessToken'); // Remove token from cookies
    };

    // Function to fetch current user based on token
    const fetchCurrentUser = async (token) => {
        try {
            const response = await axiosInstance.get('/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setUser(response.data); // Set user details if response is successful
            } else {
                setError(`Failed to fetch user details: ${response.statusText}`);
            }
        } catch (error) {
            setError('Failed to fetch user. Please try again later.');
        } finally {
            setLoading(false); // Stop loading when done
        }
    };

    // Function to validate token and load user or guest
    const validateToken = async () => {
        const storedToken = localStorage.getItem('accessToken') || Cookies.get('accessToken');

        if (storedToken) {
            await fetchCurrentUser(storedToken); // Fetch current user if token is available
        } else {
            setGuestId(generateGuestID()); // Generate guest ID if no token
            setLoading(false); // Stop loading for guests
        }
    };

    // Function to log in the user and set cookies
    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post('/api/login', credentials);
            if (response.data.token) {
                localStorage.setItem('accessToken', response.data.token); // Store token in localStorage
                Cookies.set('accessToken', response.data.token, { expires: 1 / 24 }); // Set session cookie for 1 hour
                await fetchCurrentUser(response.data.token); // Fetch current user
            }
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    // Load user or guest when component mounts
    useEffect(() => {
        validateToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, guestId, loading, error, setUser, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};


