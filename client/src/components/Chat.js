import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import axiosInstance from '../API/axiosInstance';

const Chat = ({ channel }) => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    if (!channel) {
        return <div className="chat-container">No channel selected</div>;
    }

    useEffect(() => {
        const fetchMessages = async () => {
            setError(null);
            setLoading(true);
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) throw new Error('Token not available.');

                const response = await axiosInstance.get(`/api/message/channel/${channel._id}/messages`);

                if (response.data.success && Array.isArray(response.data.messages)) {
                    setMessages(response.data.messages);
                } else {
                    throw new Error('Invalid response structure');
                }
            } catch (error) {
                setError(`Error fetching messages: ${error.response?.data?.message || error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [channel]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Token not available.');
            if (!newMessage.trim()) throw new Error('Message content is required.');

            const messagePayload = { channel_id: channel._id, content: newMessage };

            const response = await axiosInstance.post(`/api/message/channel/${channel._id}/send`, messagePayload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                setMessages((prevMessages) => [...prevMessages, response.data.message]);
                setNewMessage('');
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            setError(`Error sending message: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Token not available.');

            await axiosInstance.delete(`/api/message/channel/${channel._id}/message/${messageId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
        } catch (error) {
            setError(`Error deleting message: ${error.response?.data?.message || error.message}`);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (loading) {
        return <div className="chat-container">Loading messages...</div>;
    }

    if (error) {
        return <div className="chat-container">Error: {error}</div>;
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                {channel.name}
            </div>

            <ul className="message-list">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <li key={message._id} className="message-container">
                            <div className="message-content">{message.content}</div>
                            <div className="message-details">

                            <button
                                    className="message-delete-container"
                                    onClick={() => handleDeleteMessage(message._id)}
                                >
                                    x
                                </button>

                                <div className="message-metadata">
                                    <p>{`Creator: ${message.user_id?.username || 'Unknown User'}`}</p>
                                    <p>{`Created At: ${new Date(message.timestamp).toLocaleString()}`}</p>
                                </div>

                            </div>
                        </li>
                    ))
                ) : (
                    <p>No messages available</p>
                )}
                <div ref={messagesEndRef} />
            </ul>


            <form className="send-message-form" onSubmit={handleSendMessage}>
    <div className="send-message-input-container">
        <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            required
        />
        <button type="submit">Send</button>
    </div>
</form>


        </div>
    );
};

export default Chat;
