const Message = require("../models/Message");

module.exports = function(io) {
    const users = new Map(); // Stocker les utilisateurs connectés (socket.id <-> expediteurId)

    io.on("connection", (socket) => {
        console.log("🟢 Un utilisateur s'est connecté :", socket.id);

        // Récupérer l'ID de l'expéditeur à partir de la requête de connexion
        const expediteurId = socket.handshake.query.expediteurId;
        if (!expediteurId) {
            console.error("❌ Expéditeur ID manquant !");
            return;
        }
        users.set(expediteurId, socket.id); // Associer l'expéditeurId à socket.id
        console.log("ID de l'expéditeur :", expediteurId);

        // 📌 Envoi du message
        socket.on("sendMessage", async (data) => {
            try {
                if (typeof data === "string") {
                    data = JSON.parse(data); // Convertir la chaîne en objet JSON
                }

                console.log("Données après conversion :", data);

                if (!data.destinataireId || !data.contenu) {
                    console.error("Erreur : destinataireId et contenu sont nécessaires !");
                    return;
                }

                // Création du nouveau message
                const newMessage = new Message({
                    expediteurId: expediteurId,
                    destinataireId: data.destinataireId,
                    contenu: data.contenu,
                });

                // Sauvegarde dans la base de données
                await newMessage.save();
                console.log("Message sauvegardé :", newMessage);

                // Vérifier si le destinataire est connecté
                const destinataireSocketId = users.get(data.destinataireId);
                if (destinataireSocketId) {
                    // Si l'utilisateur est connecté, envoyer le message en temps réel
                    io.to(destinataireSocketId).emit("newMessage", newMessage);
                    console.log("Message envoyé à : " + data.destinataireId);
                } else {
                    console.log("Destinataire non connecté via WebSocket.");
                }
            } catch (error) {
                console.error("Erreur lors de l'envoi du message :", error);
            }
        });

        // 📌 Déconnexion
        socket.on("disconnect", () => {
            console.log("🔴 Un utilisateur s'est déconnecté :", socket.id);
            // Supprimer l'utilisateur de la liste des connectés
            // Recherche de l'expéditeurId correspondant au socket.id
            for (let [key, value] of users.entries()) {
                if (value === socket.id) {
                    users.delete(key); // Supprimer l'utilisateur de la map
                    console.log(`Utilisateur avec ID ${key} supprimé de la liste des connectés.`);
                    break;
                }
            }
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
