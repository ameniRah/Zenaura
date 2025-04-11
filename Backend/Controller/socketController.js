


const Message = require("../models/Message");
const { v4: uuidv4 } = require("uuid");

module.exports = function(io) {
    const users = new Map(); // socket.id <-> expediteurId
    const activeConversations = new Map(); // key: user1-user2 => { messages: [], conversationId, membres }

    const getKey = (id1, id2) => [id1, id2].sort().join("_");

    io.on("connection", (socket) => {
        console.log("🟢 Un utilisateur s'est connecté :", socket.id);

        const expediteurId = socket.handshake.query.expediteurId;
        if (!expediteurId) {
            console.error("❌ Expéditeur ID manquant !");
            return;
        }
        users.set(expediteurId, socket.id);
        console.log("ID de l'expéditeur :", expediteurId);

        socket.on("sendMessage", async (data) => {
            try {
                if (typeof data === "string") data = JSON.parse(data);
                if (!data.destinataireId || !data.contenu) {
                    console.error("Erreur : destinataireId et contenu sont nécessaires !");
                    return;
                }

                const key = getKey(expediteurId, data.destinataireId);
                if (!activeConversations.has(key)) {
                    activeConversations.set(key, {
                        conversationId: uuidv4(),
                        membres: [expediteurId, data.destinataireId],
                        messages: []
                    });
                }

                const message = {
                    expediteurId,
                    destinataireId: data.destinataireId,
                    contenu: data.contenu,
                    dateEnvoi: new Date(),
                    status: 'livré'
                };
                activeConversations.get(key).messages.push(message);

                const destinataireSocketId = users.get(data.destinataireId);
                if (destinataireSocketId) {
                    io.to(destinataireSocketId).emit("newMessage", message);
                    console.log("Message envoyé à :", data.destinataireId);
                } else {
                    socket.emit("messageStatus", {
                        status: "non-livré",
                        message: "Destinataire non connecté, message enregistré"
                    });
                }
            } catch (error) {
                console.error("Erreur lors de l'envoi du message :", error);
            }
        });

        socket.on("disconnect", async () => {
            console.log("🔴 Un utilisateur s'est déconnecté :", socket.id);

            let disconnectedUserId;
            for (let [key, value] of users.entries()) {
                if (value === socket.id) {
                    disconnectedUserId = key;
                    users.delete(key);
                    console.log(`🗑️ Utilisateur ${key} supprimé de la liste des connectés.`);
                    break;
                }
            }

            if (!disconnectedUserId) {
                console.log("⚠️ Aucun utilisateur déconnecté trouvé");
                return;
            }

            for (const [key, convo] of activeConversations.entries()) {
                if (!convo.membres.includes(disconnectedUserId)) continue;

                const [u1, u2] = convo.membres;
                const isU1Online = users.has(u1);
                const isU2Online = users.has(u2);

                console.log(`🧪 Vérification : ${u1} est ${isU1Online ? 'en ligne' : 'hors ligne'}, ${u2} est ${isU2Online ? 'en ligne' : 'hors ligne'}`);

                if (!isU1Online && !isU2Online) {
                    const message = convo.messages[0];

                    try {
                        await Message.create({
                            expediteurId: message.expediteurId,
                            destinataireId: message.destinataireId,
                            contenu: JSON.stringify(convo.messages),
                            conversationId: convo.conversationId,
                            status: 'livré',
                            dateEnvoi: new Date()
                        });
                        console.log(`✅ Conversation ${key} sauvegardée dans la base de données`);
                    } catch (err) {
                        console.error("❌ Erreur lors de la sauvegarde de la conversation :", err);
                    }

                    activeConversations.delete(key);
                }
            }
        });
    });

    async function getConversationMessages(req, res) {
        try {
            const { userId, otherUserId } = req.query;
            if (!userId || !otherUserId) {
                return res.status(400).send("Les IDs des deux utilisateurs sont nécessaires !");
            }

            const conversationId = getKey(userId, otherUserId);
            const messages = await Message.find({ conversationId }).sort({ dateEnvoi: 1 });
            if (messages.length > 0) {
                const fullConversation = JSON.parse(messages[0].contenu);
                return res.status(200).json(fullConversation);
            }
            res.status(200).json([]);
        } catch (err) {
            console.error("Erreur lors de la récupération des messages :", err);
            res.status(500).send("Erreur serveur");
        }
    }

    async function getUserConversations(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).send("L'ID de l'utilisateur est nécessaire !");
            }

            const conversations = await Message.find({
                $or: [
                    { expediteurId: userId },
                    { destinataireId: userId }
                ]
            }).sort({ dateEnvoi: -1 });

            res.status(200).json(conversations);
        } catch (err) {
            console.error("Erreur lors de la récupération des conversations :", err);
            res.status(500).send("Erreur serveur");
        }
    }

    return { 
        getConversationMessages,
        getUserConversations
    };
};
