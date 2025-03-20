// Importation des modules nécessaires
const http = require("http");
const express = require("express");
const path = require("path");

// Importation des routes
const postRouter = require("./Routes/Post");
//const commentaireRouter = require("./Routes/Commentaire");
//const messageRouter = require("./Routes/Message");

// Importation des contrôleurs
const forumController = require("./Controller/ForumController");

// Connexion MongoDB
const mongo = require("mongoose");
const db = require("./Config/db.json");

if (!db.urlnew) {
  console.error("Erreur : L'URL de la base de données est manquante !");
  process.exit(1);
}

mongo
  .connect(db.urlnew)
  .then(() => console.log("Database connected ✅"))
  .catch((err) => console.error("Erreur de connexion MongoDB ❌", err));

// Création de l'application Express
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

// Middleware pour gérer JSON et les requêtes `POST`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des routes
app.use("/post", postRouter);
//app.use("/message", messageRouter);
//app.use("/commentaire", commentaireRouter);

// Création et démarrage du serveur
const server = http.createServer(app);
server.listen(3000, () => console.log("✅ Server is running on port 3000"));
