<<<<<<< HEAD
// Chargement des variables d'environnement en premier
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = 3000;
const { swaggerUi, swaggerSpec } = require('./swagger');


// Importation du fichier de configuration de la base de données
const dbConfig = require('./config/db.json');

// Connexion à MongoDB
mongoose.connect(dbConfig.urlnew, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
  
// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());
app.use(cors());

// Importer le modèle
const CoursCategory = require('./Models/CoursCategory');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
// Importation des routes pour CoursCategory
const coursCategoryRoutes = require('./Routes/CoursCategory');
app.use('/api/coursecategories', coursCategoryRoutes);

// Route pour mettre à jour une catégorie de cours
app.post('/api/coursecategories/update/:id', async (req, res) => {
  const { id } = req.params;  // Récupère l'ID de la catégorie
  const { title, description } = req.body;  // Récupère les nouvelles données pour la catégorie

  try {
      const updatedCategory = await CoursCategory.findByIdAndUpdate(id, { title, description }, { new: true });
      if (!updatedCategory) {
          return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(updatedCategory);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Importation des routes pour Cours
const coursRoutes = require('./Routes/Cours');
app.use('/api/cours', coursRoutes);  // Nouvelle route pour les cours

// Importation des routes pour Courssession
const coursSessionRoutes = require('./Routes/CoursSession');
app.use('/api/courssessions', coursSessionRoutes);


// Route par défaut pour tester l'API
app.get('/', (req, res) => {
  res.send('Hello World!');
=======
const express = require('express');
const mongo = require('mongoose');
const db = require('./Config/db.json');
const path = require('path');
const UserRouter = require('./Routes/User');
require('dotenv').config({ path: './.env' });
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./Config/swagger');
///console.log("Clé JWT secrète: ", process.env.JWT_SECRET); 

mongo.connect(db.url)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

const app = express();
app.use('/uploads', express.static('uploads'));
app.set("views", path.join(__dirname, "views"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.set("view engine", "twig");
app.use(express.json()); // Conversion des données JSON pour les requêtes
app.use('/user', UserRouter)

const server = require('http').createServer(app);

server.listen(3000, () => {
    console.log("Server running on port 3000");
>>>>>>> user
});
