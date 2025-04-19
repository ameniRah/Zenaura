const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zenaura API',
      version: '1.0.0',
      description: 'Documentation de l\'API de Zenaura',
    },
  },
  apis: ['./Routes/*.js'], // Chemin vers vos fichiers de routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };