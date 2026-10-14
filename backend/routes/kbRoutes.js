const express = require('express');
const router = express.Router();
const { listTopics, listArticlesForTopic, getArticle, searchKb } = require('../controllers/kbController');

router.get('/search', searchKb);
router.get('/topics', listTopics);
router.get('/topics/:slug/articles', listArticlesForTopic);
router.get('/articles/:id', getArticle);

module.exports = router;
