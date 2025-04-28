const http = require("http");
const express = require("express");
const path = require("path");
const { swaggerUi, swaggerSpec } = require('./swagger');
const socketIo = require("socket.io");
const cors = require('cors');
const morgan = require("morgan");
const mongo = require("mongoose");

// Chargement des variables d'environnement en premier
require('dotenv').config({ path: './.env' });

// Création de l'application Express
var app = express();

// Middleware configurations
app.use(morgan("dev")); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/uploads/posts', express.static('uploads/posts'));

// Configuration CORS
app.use(cors());

// Configuration des vues
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route definitions
const personalityTraitRoutes = require('./Routes/personality-trait.routes');
app.use("/api/personality-traits", personalityTraitRoutes);

// test routes 
const testRoutes = require('./Routes/test.routes');
app.use("/api/tests", testRoutes);


// test-category routes 
const testCategoryRoutes = require('./Routes/test-category.routes');
app.use("/api/test-categories", testCategoryRoutes);


// test-scoring-algorithm routes
const testScoringAlgorithmRoutes = require('./Routes/test-scoring-algorithm.routes');
app.use("/api/test-scoring-algorithms", testScoringAlgorithmRoutes);


// test-session routes
const testSessionRoutes = require('./Routes/test-session.routes');
app.use("/api/test-sessions", testSessionRoutes);


// question routes
const questionRoutes = require('./Routes/question.routes');
app.use("/api/questions", questionRoutes);


// psychological-profile routes
const psychologicalProfileRoutes = require('./Routes/psychological-profile.routes');
app.use("/api/psychological-profile", psychologicalProfileRoutes);


// test-recommendation routes
const testRecommendationRoutes = require('./Routes/test-recommendation.routes');
app.use("/api/test-recommendations", testRecommendationRoutes);


// psychological-report routes
const psychologicalReportRoutes = require('./Routes/psychological-report.routes');
app.use("/api/psychological-reports", psychologicalReportRoutes);


// Connexion MongoDB
const db = require("./Config/db.json");

if (!db.url) {
  console.error("Erreur : L'URL de la base de données est manquante !");
  process.exit(1);
}

mongo
  .connect(db.url)
  .then(() => console.log("Database connected ✅"))
  .catch((err) => console.error("Erreur de connexion MongoDB ❌", err));

// Création de l'application Express  
var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(express.json());  // Middleware pour analyser les requêtes JSON

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Chargement des variables d'environnement en premier
require('dotenv').config({ path: './.env' });

// Middleware
app.use(morgan("dev")); 
app.use(express.json()); // Pour analyser les requêtes JSON
app.use(cors());         // Pour gérer les CORS
app.use('/uploads', express.static('uploads')); // Pour servir les fichiers statiques (uploads)
// Pour logger les requêtes HTTP dans la console
// Vues
app.set("views", path.join(__dirname, "views")); // Définir le dossier des vues
app.set("view engine", "twig");                  // Définir le moteur de vues comme Twig


// Création de l'application Express



// Création du serveur HTTP + WebSocket
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Autoriser les requêtes depuis toutes les origines
    methods: ["GET", "POST"]
  }
});
/*
// Importation des contrôleurs
const socketController = require("./Controller/socketController"); // Gestion WebSocket

// Initialiser la logique WebSocket avec io
const messageApi = socketController(io); */// Ce retour contient les fonctions REST
//



// Configuration du moteur de vue
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads/posts', express.static('uploads/posts'));



// Création et démarrage du serveur
server.listen(3000, () => console.log("✅ Server is running on port 3000"));