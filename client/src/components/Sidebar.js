import React, { useState } from 'react';
import useChannels from '../hooks/hooksChannels.js';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../API/axiosInstance';
import './Sidebar.css';
import './Common.css';

const Sidebar = ({ isSidebarOpen, toggleSidebar, onChannelSelect }) => {
    const { user } = useAuth();
    const [activeChannel, setActiveChannel] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const { channels, error, setChannels, setError } = useChannels();

    const handleChannelSelect = (channel) => {
        setActiveChannel(channel);
        onChannelSelect(channel);
    };

    const createChannel = async () => {
        if (!name) return;

        try {
            const channelData = { name };
            if (description.trim()) channelData.description = description;

            const response = await axiosInstance.post('/api/channel', channelData);
            setChannels((prev) => [...prev, response.data]);
            setName('');
            setDescription('');
            setShowCreateChannel(false);
        } catch (err) {
            const errorMessage = err.response?.status === 404 ? 'Endpoint not found.' :
                err.message.includes('CORS') ? 'CORS error. Check server settings.' :
                'Failed to create channel.';
            setError(errorMessage);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            createChannel();
        }
    };

    const deleteChannel = async (channelId) => {
        try {
            await axiosInstance.delete(`/api/channel/${channelId}`);
            setChannels((prev) => prev.filter(channel => channel._id !== channelId));
            if (activeChannel?._id === channelId) {
                setActiveChannel(null);
                onChannelSelect(null);
            }
        } catch (err) {
            setError(err.response?.status === 404 ? 'Channel not found.' : 'Failed to delete channel.');
        }
    };

    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <button className="add-channel-button" onClick={() => setShowCreateChannel(!showCreateChannel)}>
                {showCreateChannel ? '✕' : '＋ Channel'}
            </button>

            {isSidebarOpen && (
                <>
                    {error && <p className="error">{error}</p>}

                    <ul className="channel-menu">
                        {channels.map(channel => (
                            <li key={channel._id} className="channel-item">
                                <span onClick={() => handleChannelSelect(channel)}>
                                    {channel.name}: {channel.description || '_'}
                                </span>
                                <button
                                    className="delete-button-container"
                                    onClick={() => deleteChannel(channel._id)}
                                    aria-label={`Delete ${channel.name}`}
                                >
                                    🗑️
                                </button>
                            </li>
                        ))}
                    </ul>

                    {showCreateChannel && (
                        <div className="modal-overlay" onClick={() => setShowCreateChannel(false)}>
                            <div className="create-channel" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowCreateChannel(false)}
                                    className="close-button"
                                    aria-label="Close modal"
                                >
                                    ✕
                                </button>
                                <h3>Create New Channel</h3>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Channel Name"
                                    onKeyDown={handleKeyDown}
                                />
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Channel Description (optional)"
                                    onKeyDown={handleKeyDown}
                                    className="description-input"
                                />
                                <button onClick={createChannel} disabled={!name}>
                                    Create Channel
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Sidebar;
