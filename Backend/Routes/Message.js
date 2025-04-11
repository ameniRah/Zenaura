const express = require('express');
const router = express.Router();

// Importer uniquement les fonctions REST
const { getConversationMessages, getUserConversations } = require('../Controller/socketController');

// Définir les routes REST
router.get('/conversation', getConversationMessages);
router.get('/conversations/:userId', getUserConversations);

module.exports = router;
