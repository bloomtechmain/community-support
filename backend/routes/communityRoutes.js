const express = require('express');
const router = express.Router();
const { listQuestions, getQuestion, submitQuestion, submitReply } = require('../controllers/communityController');

router.get('/questions', listQuestions);
router.get('/questions/:id', getQuestion);
router.post('/questions', submitQuestion);
router.post('/questions/:id/replies', submitReply);

module.exports = router;
