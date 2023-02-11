const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatgptController');

router.post('/chatgpt', chatController.chatgpt);

module.exports = router;