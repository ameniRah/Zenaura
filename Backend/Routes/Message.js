// Routes/Message.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

module.exports = function(io) {
  // 📌 READ: Récupérer les messages via API REST
  router.get("/getMessages", async (req, res) => {
    try {
      const messages = await Message.find();
      res.status(200).json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération des messages" });
    }
  });

  return router;
}; 