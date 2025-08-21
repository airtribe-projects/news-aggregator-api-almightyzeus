
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const newsController = require('../controllers/newsController');

router.get('/', auth, newsController.getNews);
router.post('/:id/read', auth, newsController.markAsRead);
router.post('/:id/favorite', auth, newsController.markAsFavorite);
router.get('/read', auth, newsController.getReadArticles);
router.get('/favorites', auth, newsController.getFavoriteArticles);
router.get('/search/:keyword', auth, newsController.searchNews);

module.exports = router;
