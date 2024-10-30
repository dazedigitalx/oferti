// rssRouter.js
const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js'); // Import xml2js for XML parsing

const router = express.Router();

// Handle the GET request to /api/rss
router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://www.travelzoo.com/feed/');
        
        // Parse the XML response to JSON
        xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return res.status(500).json({ error: 'Error parsing RSS feed' });
            }

            // Assuming the feed structure; adapt if necessary
            const articles = result.feed.entry.map(item => ({
                title: item.title?._ || 'No title', // Safely access title
                url: item.link.$.href || '#', // Safely access URL
                summary: item.summary?._ || 'No summary available', // Safely access summary
            }));

            res.json({ articles }); // Send the parsed JSON as the response
        });
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).json({ error: 'Error fetching RSS feed' });
    }
});

module.exports = router;
