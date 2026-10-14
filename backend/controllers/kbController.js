const {
  getTopics,
  getTopicBySlug,
  getArticlesByTopicSlug,
  getArticleById,
  searchArticles,
} = require('../models/kbModel');

const listTopics = async (req, res) => {
  try {
    const topics = await getTopics();
    res.status(200).json({ topics });
  } catch (error) {
    console.error('List KB topics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const listArticlesForTopic = async (req, res) => {
  try {
    const topic = await getTopicBySlug(req.params.slug);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    const articles = await getArticlesByTopicSlug(req.params.slug);
    res.status(200).json({ topic, articles });
  } catch (error) {
    console.error('List KB articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getArticle = async (req, res) => {
  try {
    const article = await getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json({ article });
  } catch (error) {
    console.error('Get KB article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const searchKb = async (req, res) => {
  try {
    const { q, topic } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json({ articles: [] });
    }
    const articles = await searchArticles(q.trim(), topic || null);
    res.status(200).json({ articles });
  } catch (error) {
    console.error('KB search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listTopics, listArticlesForTopic, getArticle, searchKb };
