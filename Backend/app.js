const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = 3000;

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
const CoursCategory = require('./models/CoursCategory');

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
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});