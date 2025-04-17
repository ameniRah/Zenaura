// Modules de base
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Swagger + Middleware de validation
const { swaggerUi, swaggerSpec } = require('./swagger');
const validationMiddleware = require('./middleware/validation.middleware');

// Configuration
const db = require('./Config/db.json');
const PORT = process.env.PORT || 3000;

// Vérification de l'URL MongoDB
if (!db.urlnew) {
  console.error("❌ Erreur : L'URL de la base de données est manquante !");
  process.exit(1);
}

// Connexion à MongoDB
mongoose.connect(db.urlnew)
  .then(() => console.log("✅ Base de données connectée"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// Initialisation de l'application Express
const app = express();

// Configuration du moteur de vue (si utilisé)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes principales
const authRoutes = require('./routes/auth.routes');
const personalityTraitRoutes = require('./routes/personality-trait.routes');
const testRoutes = require('./routes/test.routes');

const dispoRouter = require("./Routes/Dispo");
const rendezvousRouter = require("./Routes/RendezVous");
const eventsRouter = require("./Routes/Evenement");
const notificationRouter = require("./Routes/Notification");

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/personality-traits', personalityTraitRoutes);
app.use('/api/tests', testRoutes);

app.use("/apis", dispoRouter);
app.use("/apis", rendezvousRouter);
app.use("/apis", eventsRouter); 
app.use("/apis", notificationRouter);

// Route de base
app.get('/', (req, res) => {
  res.json({ message: '🌿 Bienvenue sur l’API ZenAura' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: '❌ Route non trouvée' });
});

// Middleware d’erreur
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

app.use(validationMiddleware.handleMongooseError);
app.use(validationMiddleware.errorHandler);

// Démarrage du serveur
http.createServer(app).listen(PORT, () => {
  console.log(`✅ Serveur en cours d'exécution sur le port ${PORT}`);
});
