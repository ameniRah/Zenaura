// swagger.js

const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de gestion',
    version: '1.0.0',
    description: 'Documentation de l\'API de mon projet MEAN',
  },
  servers: [
    {
      url: 'http://localhost:3000', // adapte le port si nécessaire
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./Routes/*.js'], // ici, tu mets le chemin de tes fichiers route
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

