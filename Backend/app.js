// Chargement des variables d'environnement en premier
require('dotenv').config({ path: './.env' });

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Swagger
const { swaggerUi, swaggerSpec } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Importation du fichier de configuration de la base de données
const dbConfig = require('./Config/db.json');

// Connexion à MongoDB
mongoose.connect(dbConfig.urlnew || dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(express.json()); // Pour analyser les requêtes JSON
app.use(cors());         // Pour gérer les CORS
app.use('/uploads', express.static('uploads')); // Pour servir les fichiers statiques (uploads)

// Vues
app.set("views", path.join(__dirname, "views")); // Définir le dossier des vues
app.set("view engine", "twig");                  // Définir le moteur de vues comme Twig

// ======== ROUTES ========
const testRoutes = require('./Routes/testRoutes'); // Ajustez le chemin selon votre structure
app.use('/api/test', testRoutes);
// Routes pour les utilisateurs
const UserRouter = require('./Routes/User');
app.use('/user', UserRouter);

// Routes pour les catégories de cours
const CoursCategory = require('./Models/CoursCategory');
const coursCategoryRoutes = require('./Routes/CoursCategory');
app.use('/api/coursecategories', coursCategoryRoutes);

// Routes pour les cours
const coursRoutes = require('./Routes/Cours');
app.use('/api/cours', coursRoutes);

// Routes pour les sessions de cours
const coursSessionRoutes = require('./Routes/CoursSession');
app.use('/api/courssessions', coursSessionRoutes);

// Route pour mettre à jour une catégorie de cours
app.post('/api/coursecategories/update/:id', async (req, res) => {
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

// Route par défaut
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Lancement du serveur
const server = require('http').createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});