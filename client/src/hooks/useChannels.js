// src/hooks/useChannels.js
import { useEffect, useState } from 'react';
import axiosInstance from '../API/axiosInstance';

const useChannels = () => {
    const [channels, setChannels] = useState([]);
    const [error, setError] = useState(null);

    const fetchChannels = async () => {
        try {
            const response = await axiosInstance.get('/api/channels'); // Ensure this endpoint exists
            setChannels(response.data);
        } catch (err) {
            console.error('Error fetching channels:', err);
            setError(err);
        }
    };

    useEffect(() => {
        fetchChannels();
    }, []);

    return { channels, error };
};

export default useChannels;
