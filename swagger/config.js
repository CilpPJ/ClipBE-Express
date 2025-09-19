import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ClipBE-Express',
      description: 'CLIP 개발용 서버',
      version: 'v2.0.0',
    },
    servers: [
      {
        url: 'https://clip-be-express.vercel.app/',
        description: 'Develop Server',
      },
      {
        url: 'http://localhost:8081/',
        description: 'Local Server',
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
  },
  apis: ['_auth.swagger.js', './*.swagger.js', './swagger/*'],
};

const specs = swaggerJsdoc(options);

const swaggerUiOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.0/swagger-ui.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.0/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.0/swagger-ui-standalone-preset.js',
  ],
};

export const setupSwagger = (app) => {
  app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

  // JSON 명세 보기용
  app.get('/swagger.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  // Redirect /swagger-ui to the Swagger UI
  app.get('/swagger', (_, res) => {
    res.redirect('/swagger-ui/');
  });
};
