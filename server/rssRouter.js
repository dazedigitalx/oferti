// rssRouter.js
const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();
const RSS_FEED_URL = 'https://rss.app/feeds/tlHsPl1pnjpaQERv.xml';

// Function to parse XML to JSON
const parseXML = (data) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(data, { explicitArray: false }, (err, result) => {
            if (err) {
                return reject(new Error('Error parsing XML'));
            }
            resolve(result);
        });
    });
};

// Handle the GET request to /api/rss
router.get('/', async (req, res) => {
    try {
        // Fetch the RSS feed
        const response = await axios.get(RSS_FEED_URL);
        const result = await parseXML(response.data);

        // Log the result to see its structure
        console.log('Parsed XML Result:', JSON.stringify(result, null, 2));

        // Safely access entries
        const entries = result.rss?.channel?.item ? result.rss.channel.item : [];

        // If entries is a single object, wrap it in an array
        const articles = Array.isArray(entries) ? entries : [entries].filter(Boolean);

        // Check if we have articles
        if (!articles.length) {
            console.warn('No articles found in the RSS feed.');
            return res.status(404).json({ error: 'No articles found in the feed' });
        }

        // Map the entries to the desired structure
        const mappedArticles = articles.map(item => ({
            title: item.title?._ || 'No title', // Accessing title
            description: item.description?._ || 'No description available', // Accessing description
            url: item.link || '#', // Accessing URL
            guid: item.guid?._ || 'No GUID available', // Accessing GUID
            creator: item['dc:creator']?._ || 'Unknown Creator', // Accessing creator
            pubDate: item.pubDate || 'No publication date available', // Accessing publication date
            mediaContent: item['media:content']?.$.url || null, // Accessing media content URL
        }));

        // Send the parsed articles as the response
        res.json({ articles: mappedArticles });
    } catch (error) {
        console.error('Error fetching RSS feed:', error.message || error);
        res.status(500).json({ error: 'Error fetching RSS feed' });
    }
});

module.exports = router;
