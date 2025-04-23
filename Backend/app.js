// Chargement des variables d'environnement
require('dotenv').config();

// Modules de base
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const config = require('./Config/config'); // Assurez-vous que le chemin est correct

// Swagger + Middleware de validation
const { swaggerUi, swaggerSpec } = require('./swagger');
const validationMiddleware = require('./Middll/validation.middleware');

// Configuration
const db = require('./config/db.json'); // Assurez-vous que le chemin est bien en minuscule
const PORT = process.env.PORT || 3000;

// Vérification de l'URL MongoDB
if (!db.urlnew) {
  console.error("❌ Erreur : L'URL de la base de données est manquante !");
  process.exit(1);
}

// Connexion à MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/zenaura';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Initialisation de l'application Express
/*const app = express();*/

// Configuration du moteur de vue (si utilisé)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// === Importation des routes ===
const dispoRouter = require('./Routes/Dispo');
const rendezvousRouter = require('./Routes/RendezVous');
const eventsRouter = require('./Routes/Evenement');
const notificationRouter = require('./Routes/Notification');
const coursCategoryRoutes = require('./Routes/CoursCategory');
const coursRoutes = require('./Routes/Cours');
const coursSessionRoutes = require('./Routes/CoursSession');
const authRoutes = require('./Routes/auth.routes');
const personalityTraitRoutes = require('./Routes/personality-trait.routes');
const testRoutes = require('./Routes/test.routes');
const TestSessionRoutes = require('./Routes/test-session.routes');
const TestScoringAlgorithmRoutes = require('./Routes/test-scoring-algorithm.routes');
const TestRecommendationRoutes = require('./Routes/test-recommendation.routes');
const TestCategoryRoutes = require('./Routes/test-category.routes');
const questionRoutes = require('./Routes/question.routes');
const PsychologicalProfileRoutes = require('./Routes/psychological-profile.routes');
const PsychologicalReportRoutes = require('./Routes/psychological-report.routes');
const UserRoutes = require('./Routes/User.routes');

// === Utilisation des routes ===
app.use('/api/auth', authRoutes);
app.use('/api/personality-traits', personalityTraitRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/test-sessions', TestSessionRoutes);
app.use('/api/test-scoring-algorithms', TestScoringAlgorithmRoutes);
app.use('/api/test-recommendations', TestRecommendationRoutes);
app.use('/api/test-categories', TestCategoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/psychological-profiles', PsychologicalProfileRoutes);
app.use('/api/psychological-reports', PsychologicalReportRoutes);
app.use('/api/users', UserRoutes);

// Legacy routes with old prefix
app.use('/apis', dispoRouter);
app.use('/apis', rendezvousRouter);
app.use('/apis', eventsRouter);
app.use('/apis', notificationRouter);

const User = require('./Models/User');

// POST route to add a user
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mise à jour d'une catégorie de cours (endpoint spécifique)
//const CoursCategory = require('./Models/CoursCategory');
/*app.post('/api/coursecategories/update/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedCategory = await CoursCategory.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
*/
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

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

module.exports = app;
