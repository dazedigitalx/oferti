// controllers/messageController.js

const Message = require('../models/Message'); // Make sure this model exists
const Channel = require('../models/Channel'); // Assuming you have a Channel model

// GET all messages for a channel
const getChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.params; // Channel ID from the request parameters

        // Fetch messages using the correct field names
        const messages = await Message.find({ channel_id: channelId }) // Use channel_id for filtering
            .populate('user_id', 'username'); // Populate user details, assuming 'user_id' in Message matches user model

        // Format messages to include all required fields
        const formattedMessages = messages.map(message => ({
            _id: message._id,
            channel_id: message.channel_id,
            user_id: message.user_id,
            content: message.content,
            message_id: message._id, // Use the message's ID as message_id
            timestamp: message.timestamp,
            __v: message.__v,
        }));

        res.status(200).json({ success: true, messages: formattedMessages }); // Return a success response with formatted messages
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Error fetching messages', error: error.message });
    }
};

// POST a new message to a channel
const sendMessage = async (req, res) => {
    try {
        const { channelId } = req.params; // Assuming channel ID comes from URL
        const { content } = req.body; // Content of the message
        const userId = req.user.id; // Retrieve user ID from the authenticated user

        // Create a new message instance
        const newMessage = new Message({
            content,
            channel_id: channelId,
            user_id: userId, // Ensure you're using the correct field
            timestamp: Date.now(),
        });

        // Save the new message to the database
        await newMessage.save();

        // Return the new message in the required format
        res.status(201).json({ 
            success: true, 
            message: {
                _id: newMessage._id,
                channel_id: newMessage.channel_id,
                user_id: newMessage.user_id,
                content: newMessage.content,
                message_id: newMessage._id,
                timestamp: newMessage.timestamp,
                __v: newMessage.__v,
            }
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
    }
};

// DELETE a message by ID
const deleteMessage = async (req, res) => {
    try {
        const { channelId, messageId } = req.params;
        const deletedMessage = await Message.findOneAndDelete({ _id: messageId, channel_id: channelId }); // Use channel_id

        if (!deletedMessage) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ success: false, message: 'Error deleting message', error: error.message });
    }
};

// GET a message by ID
const getMessageById = async (req, res) => {
    try {
        const { channelId, messageId } = req.params;
        const message = await Message.findOne({ _id: messageId, channel_id: channelId }); // Use _id for fetching

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        // Format the response message to match the required structure
        const formattedMessage = {
            _id: message._id,
            channel_id: message.channel_id,
            user_id: message.user_id,
            content: message.content,
            message_id: message._id,
            timestamp: message.timestamp,
            __v: message.__v,
        };

        res.json({ success: true, message: formattedMessage });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ success: false, message: 'Error fetching message', error: error.message });
    }
};

module.exports = {
    getChannelMessages,
    sendMessage,
    deleteMessage,
    getMessageById,
};
