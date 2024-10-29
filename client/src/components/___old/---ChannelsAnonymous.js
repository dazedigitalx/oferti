import { useState, useEffect } from 'react';
import axiosInstance from '../API/axiosInstance';

const useChannelsAnonymous = () => {
    const [channels, setChannels] = useState([]);
    const [error, setError] = useState('');
    
    // Generate or retrieve anonymous ID
    const getAnonymousId = () => {
        let anonymousId = localStorage.getItem('anonymousId');
        if (!anonymousId) {
            anonymousId = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('anonymousId', anonymousId);
        }
        return anonymousId;
    };

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const anonymousId = getAnonymousId();
                const response = await axiosInstance.get('/api/anonymous', {
                    params: { anonymousId }
                });
                setChannels(response.data);
            } catch (err) {
                console.error('Error fetching channels:', err);
                if (err.response && err.response.status === 404) {
                    setError('Channels not found.');
                } else if (err.message.includes('CORS')) {
                    setError('CORS error. Please check server settings.');
                } else {
                    setError('Failed to fetch channels.');
                }
            }
        };

        fetchChannels();
    }, []);

    return { channels, error };
};

export default useChannelsAnonymous;
