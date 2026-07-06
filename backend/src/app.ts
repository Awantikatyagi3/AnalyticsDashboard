import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './routes';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Configure Swagger/OpenAPI definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DENA Analytics Dashboard API Documentation',
      version: '1.0.0',
      description: 'Complete OpenAPI Documentation for the Node.js + Express + SQLite backend servicing the DENA analytics platform.',
      contact: {
        name: 'Technical Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide your JWT authorization token in the header. Format: "Bearer <token>"'
        }
      }
    }
  },
  // Parse Swagger definitions from both TS files (in development) and JS files (in production)
  apis: ['./src/routes/*.ts', './dist/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger Interactive API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve raw OpenAPI Spec JSON for client code generators
app.get('/openapi.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Spring Boot Actuator-compatible endpoint mappings for Specmatic coverage report
app.get('/actuator/mappings', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    contexts: {
      application: {
        mappings: {
          dispatcherServlets: {
            dispatcherServlet: [
              {
                handler: 'AuthController.loginUser',
                predicate: '{POST [/api/auth/login]}',
                details: {
                  handlerMethod: {
                    className: 'AuthController',
                    name: 'loginUser'
                  },
                  requestMappingConditions: {
                    methods: ['POST'],
                    patterns: ['/api/auth/login']
                  }
                }
              },
              {
                handler: 'DashboardController.getDashboards',
                predicate: '{GET [/api/dashboards]}',
                details: {
                  handlerMethod: {
                    className: 'DashboardController',
                    name: 'getDashboards'
                  },
                  requestMappingConditions: {
                    methods: ['GET'],
                    patterns: ['/api/dashboards']
                  }
                }
              },
              {
                handler: 'DashboardController.getDashboardById',
                predicate: '{GET [/api/dashboards/{id}]}',
                details: {
                  handlerMethod: {
                    className: 'DashboardController',
                    name: 'getDashboardById'
                  },
                  requestMappingConditions: {
                    methods: ['GET'],
                    patterns: ['/api/dashboards/{id}']
                  }
                }
              },
              {
                handler: 'AnalyticsController.getAnalytics',
                predicate: '{GET [/api/analytics/{category}]}',
                details: {
                  handlerMethod: {
                    className: 'AnalyticsController',
                    name: 'getAnalytics'
                  },
                  requestMappingConditions: {
                    methods: ['GET'],
                    patterns: ['/api/analytics/{category}']
                  }
                }
              },
              {
                handler: 'InsightController.generateInsights',
                predicate: '{POST [/api/insights]}',
                details: {
                  handlerMethod: {
                    className: 'InsightController',
                    name: 'generateInsights'
                  },
                  requestMappingConditions: {
                    methods: ['POST'],
                    patterns: ['/api/insights']
                  }
                }
              }
            ]
          }
        }
      }
    }
  });
});


// Root check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'DENA Analytics Dashboard API is running.',
    documentation: '/api-docs',
    openapiSpec: '/openapi.json'
  });
});

// Mount modular API routes under /api
app.use('/api', router);

// Catch-all route for unmatched paths (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Endpoint '${req.method} ${req.originalUrl}' does not exist.` });
});

// Global centralized error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Central Error Handler caught error:', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'An internal server error occurred',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

export default app;
