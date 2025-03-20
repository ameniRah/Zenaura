// Importation des modules nécessaires
const http = require("http");
const express = require("express");
const path = require("path");

// Importation des routes
const dispoRouter = require("./Routes/Dispo");

// Importation des contrôleurs
const planningController = require("./Controller/PlanningController");

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
var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(express.json());  // Middleware pour analyser les requêtes JSON


// Configuration des routes
app.use("/apis", dispoRouter);

// Création et démarrage du serveur
const server = http.createServer(app);
server.listen(3000, () => console.log("✅ Server is running on port 3000"));