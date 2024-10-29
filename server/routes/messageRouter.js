const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// GET all messages for a channel
router.get('/channel/:channelId/messages', authMiddleware, messageController.getChannelMessages);

// POST a new message to a channel
router.post('/channel/:channelId/send', authMiddleware, messageController.sendMessage);

// DELETE a message by ID
router.delete('/channel/:channelId/message/:messageId', authMiddleware, messageController.deleteMessage);

// GET a message by ID
router.get('/channel/:channelId/message/:messageId', authMiddleware, messageController.getMessageById);

module.exports = router;
