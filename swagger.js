const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const base_path = process.env.BASE_PATH || '';
// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Api pocisiones',
      version: '1.0.0',
      description: 'API con basePath configurado',
    },
    servers: [
      {
        url: base_path, // Define el basePath aquí
        description: 'Servidor base',
      },
    ],
  },
  apis: ['./routes/*.js'], // Archivos donde se encuentran los endpoints documentados
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = {
    swaggerDocs,
    swaggerUi,
};