// Importation des modules nécessaires
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");
const { swaggerUi, swaggerSpec } = require('./swager');




// Connexion MongoDB
const db = require("./Config/db.json");

if (!db.urlnew) {
  console.error("❌ Erreur : L'URL de la base de données est manquante !");
  process.exit(1);
}

mongoose
  .connect(db.urlnew)
  .then(() => console.log("✅ Base de données connectée"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// Création de l'application Express
const app = express();

// Création du serveur HTTP + WebSocket
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Autoriser les requêtes depuis toutes les origines
    methods: ["GET", "POST"]
  }
});

// Importation des contrôleurs
const socketController = require("./Controller/socketController"); // Gestion WebSocket

// Initialiser la logique WebSocket avec io
const messageApi = socketController(io); // Ce retour contient les fonctions REST
//

// Importation des routes
const postRouter = require("./Routes/Post");
const commentaireRouter = require("./Routes/Commentaire");
const groupeRouter = require("./Routes/group");



// Configuration du moteur de vue
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 📌 Configuration des routes REST
app.use("/post", postRouter);
app.use("/commentaire", commentaireRouter);
app.use("/group", groupeRouter);

// Routes REST liées aux messages
app.get("/message/conversation", messageApi.getConversationMessages);
app.get("/message/conversations/:userId", messageApi.getUserConversations);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
