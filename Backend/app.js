// Importation des modules nécessaires
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");

// Connexion MongoDB
const db = require("./Config/db.json");

if (!db.urlnew) {
  console.error("Erreur : L'URL de la base de données est manquante !");
  process.exit(1);
}

mongoose
  .connect(db.urlnew) // Connexion à la base de données
  .then(() => console.log("Database connected ✅"))
  .catch((err) => console.error("Erreur de connexion MongoDB ❌", err));

// Création de l'application Express
const app = express();

// Création du serveur HTTP et initialisation de Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Permet les connexions CORS de n'importe quelle origine
    methods: ["GET", "POST"]
  }
});

// Importation des contrôleurs
const forumController = require("./Controller/ForumController");
const socketController = require("./Controller/socketController"); // Importer le contrôleur des sockets

// Passer l'instance de `io` au contrôleur Socket.IO
socketController(io);

// Importation des routes (maintenant que `io` est défini)
const postRouter = require("./Routes/Post");
const commentaireRouter = require("./Routes/Commentaire");
const messageRouter = require('./Routes/Message');
const messageRoute = messageRouter(io); // <- déplacer ici

// Configuration des moteurs de vue et des middlewares
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des routes
app.use("/post", postRouter);
app.use("/message", messageRouter(io)); // Passer `io` dans les routes de messages
app.use("/commentaire", commentaireRouter);


// Démarrer le serveur
server.listen(3000, () => {
  console.log("✅ Server is running on port 3000");
});
