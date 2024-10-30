// src/utils/fetchRssUrls.js

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const RSS_FEED_URL = 'https://theblondeabroad.com/feed';

export const fetchRssUrls = async () => {
    try {
        const response = await axios.get(RSS_FEED_URL);
        const xml = response.data;

        const parser = new XMLParser();
        const jsonObj = parser.parse(xml);

        if (!jsonObj.rss?.channel?.item) {
            console.error('Failed to parse items from RSS feed:', jsonObj);
            return [];
        }

        const urls = jsonObj.rss.channel.item.map(item => ({
            title: item.title,
            url: item.link,
            image: item['media:content']?.url || 'default-image.jpg', // Replace with fallback
        }));

        console.log('Fetched and parsed articles:', urls); // Debugging log
        return urls;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return [];
    }
};
