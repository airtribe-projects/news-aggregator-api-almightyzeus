
const axios = require('axios');
const User = require('../models/usersModel');

// In-memory cache: { [userId]: { articles, timestamp, preferencesKey } }
const newsCache = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getPreferencesKey(preferences) {
    return preferences.sort().join(',');
}

const getNews = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const preferences = user.preferences || [];
        if (!preferences.length) {
            return res.status(400).json({ message: 'No preferences set for user' });
        }
        const preferencesKey = getPreferencesKey(preferences);
        const now = Date.now();
        // Check cache
        if (
            newsCache[user.id] &&
            newsCache[user.id].preferencesKey === preferencesKey &&
            now - newsCache[user.id].timestamp < CACHE_TTL
        ) {
            return res.json({ news: newsCache[user.id].articles, cached: true });
        }
        // Fetch from NewsAPI
        const query = preferences.join(' OR ');
        const apiKey = process.env.NEWS_API_KEY;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
        const response = await axios.get(url);
        // Update cache
        newsCache[user.id] = {
            articles: response.data.articles,
            timestamp: now,
            preferencesKey
        };
        res.json({ news: response.data.articles, cached: false });
    } catch (err) {
        if (err.response) {
            return res.status(502).json({ message: 'News API error', details: err.response.data });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark article as read
const markAsRead = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const articleId = req.params.id;
        if (!articleId) return res.status(400).json({ message: 'Article ID required' });
        if (!user.readArticles.includes(articleId)) {
            user.readArticles.push(articleId);
            await user.save();
        }
        res.json({ message: 'Article marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark article as favorite
const markAsFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const articleId = req.params.id;
        if (!articleId) return res.status(400).json({ message: 'Article ID required' });
        if (!user.favoriteArticles.includes(articleId)) {
            user.favoriteArticles.push(articleId);
            await user.save();
        }
        res.json({ message: 'Article marked as favorite' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all read articles
const getReadArticles = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ readArticles: user.readArticles });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all favorite articles
const getFavoriteArticles = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ favoriteArticles: user.favoriteArticles });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Search news by keyword
const searchNews = async (req, res) => {
    try {
        const keyword = req.params.keyword;
        if (!keyword) return res.status(400).json({ message: 'Keyword required' });
        const apiKey = process.env.NEWS_API_KEY;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&apiKey=${apiKey}`;
        const response = await axios.get(url);
        res.json({ news: response.data.articles });
    } catch (err) {
        if (err.response) {
            return res.status(502).json({ message: 'News API error', details: err.response.data });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Periodic cache update (every 10 minutes)
setInterval(async () => {
    for (const userId in newsCache) {
        try {
            const user = await User.findById(userId);
            if (!user) continue;
            const preferences = user.preferences || [];
            if (!preferences.length) continue;
            const preferencesKey = getPreferencesKey(preferences);
            const query = preferences.join(' OR ');
            const apiKey = process.env.NEWS_API_KEY;
            const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
            const response = await axios.get(url);
            newsCache[userId] = {
                articles: response.data.articles,
                timestamp: Date.now(),
                preferencesKey
            };
        } catch (err) {
            // Ignore errors in background update
        }
    }
}, CACHE_TTL);

module.exports = {
    getNews,
    markAsRead,
    markAsFavorite,
    getReadArticles,
    getFavoriteArticles,
    searchNews
};
