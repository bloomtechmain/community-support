const {
  createQuestion,
  getQuestions,
  getQuestionById,
  getRepliesForQuestion,
  createReply,
} = require('../models/communityModel');

const listQuestions = async (req, res) => {
  try {
    const { search, filter } = req.query;
    const questions = await getQuestions({ search, filter });
    res.status(200).json({ questions });
  } catch (error) {
    console.error('List community questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getQuestion = async (req, res) => {
  try {
    const question = await getQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const replies = await getRepliesForQuestion(req.params.id);
    res.status(200).json({ question, replies });
  } catch (error) {
    console.error('Get community question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitQuestion = async (req, res) => {
  try {
    const { name, email, title, body } = req.body;

    if (!name || !title || !body) {
      return res.status(400).json({ message: 'Name, title, and body are required' });
    }

    const question = await createQuestion({ name, email, title, body });

    res.status(201).json({ message: 'Question posted successfully', question });
  } catch (error) {
    console.error('Community question submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitReply = async (req, res) => {
  try {
    const { name, email, body } = req.body;

    if (!name || !body) {
      return res.status(400).json({ message: 'Name and body are required' });
    }

    const question = await getQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const reply = await createReply({ questionId: req.params.id, name, email, body });

    res.status(201).json({ message: 'Reply posted successfully', reply });
  } catch (error) {
    console.error('Community reply submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listQuestions, getQuestion, submitQuestion, submitReply };
