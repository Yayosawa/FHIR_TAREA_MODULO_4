import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { errorHandler, notFound } from './middleware';
import { openApiConfig } from './config';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    })
  );

  // CORS middleware
  app.use(cors());

  // Body parser middleware
  // Support both standard JSON and FHIR JSON content types
  app.use(express.json({ type: ['application/json', 'application/fhir+json'] }));
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
  }

  // Swagger UI documentation endpoint - Matches Java facade at /baseR4/docs
  app.use(
    '/baseR4/docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiConfig, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'FHIR Facade API - TypeScript (Express)',
      customfavIcon: 'https://www.hl7.org/fhir/favicon.ico'
    })
  );

  // OpenAPI JSON endpoint - Matches Java facade at /baseR4/openapi
  app.get('/baseR4/openapi', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(openApiConfig);
  });

  // FHIR R4 Base URL
  app.use('/baseR4', routes);

  // Root endpoint - FHIR Server Information
  app.get('/', (_req, res) => {
    res.json({
      resourceType: 'Bundle',
      type: 'searchset',
      entry: [
        {
          resource: {
            resourceType: 'CapabilityStatement',
            status: 'active',
            date: new Date().toISOString(),
            kind: 'instance',
            fhirVersion: '4.0.1',
            format: ['json'],
            implementation: {
              description: 'FHIR Facade API for Chilean Medical Appointments',
              url: 'http://localhost:3000/baseR4',
            },
            rest: [
              {
                mode: 'server',
                documentation: 'FHIR R4 RESTful API',
                resource: [
                  { type: 'Patient' },
                  { type: 'Practitioner' },
                ],
              },
            ],
          },
        },
      ],
    });
  });

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
