import swaggerJsdoc, { SwaggerDefinition } from 'swagger-jsdoc';
import { version } from '../package.json';
import config from './config/config';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.1.0',
  info: {
    title: 'Mono Bank API Documentation',
    version: version,
    description: 'This is a bank account management REST API',
    basePath: 'http://localhost:8000/docs',
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}/`,
      description: 'Local server',
    },
    {
      url: 'https://events-api-cav5.onrender.com/docs',
      description: 'Live server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;
