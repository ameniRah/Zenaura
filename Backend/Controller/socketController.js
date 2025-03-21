// Controller/socketController.js
const Message = require("../models/Message");

module.exports = function(io) {
    io.on("connection", (socket) => {
        console.log("🟢 Un utilisateur s'est connecté :", socket.id);
    
        // Récupérer l'ID de l'expéditeur de l'URL de la connexion
        const expediteurId = socket.handshake.query.expediteurId;
        console.log("ID de l'expéditeur : ", expediteurId);
    
        // 📌 Événement pour l'envoi du message
        socket.on("sendMessage", async (data) => {
          console.log("Données reçues pour l'envoi du message :", data);
       
          
          try {
            // Vérification des données nécessaires
            if (!data.destinataireId || !data.contenu) {
              console.error("Erreur : destinataireId et contenu sont nécessaires !");
              return;
            }
            // Création du message avec l'expéditeur et le destinataire
            const newMessage = new Message({
              expediteurId: expediteurId, // ID de l'expéditeur
              destinataireId: data.destinataireId, // ID du destinataire
              contenu: data.contenu, // Contenu du message
            });
    
            // Sauvegarde du message dans la base de données
            await newMessage.save();
            console.log("Message sauvegardé :", newMessage);
    
            // Diffuser l'événement "newMessage" à tous les clients
            io.emit("newMessage", newMessage);
          } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
          }
        });
    
        // 📌 Déconnexion de l'utilisateur
        socket.on("disconnect", () => {
          console.log("🔴 Un utilisateur s'est déconnecté :", socket.id);
        });
      });

  // 📌 Récupérer tous les messages via l'API REST
  async function getMessages(req, res) {
    try {
      // Recherche des messages filtrés par expéditeur et destinataire
      const { expediteurId, destinataireId } = req.query;

      if (!expediteurId || !destinataireId) {
        return res.status(400).send("Les IDs de l'expéditeur et du destinataire sont nécessaires !");
      }

      // Recherche des messages entre les deux utilisateurs
      const messages = await Message.find({
        $or: [
          { expediteurId, destinataireId },
          { expediteurId: destinataireId, destinataireId: expediteurId }
        ]
      });

      console.log("Messages récupérés :", messages);

      res.status(200).json(messages);
    } catch (err) {
      console.error("Erreur lors de la récupération des messages :", err);
      res.status(500).send("Erreur serveur");
    }
  }

  // Exposer la fonction pour récupérer les messages
  return { getMessages };
}; 