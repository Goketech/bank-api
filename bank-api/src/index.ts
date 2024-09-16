import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { auth, account, transaction } from './routes';
import swaggerUi from 'swagger-ui-express';
import config from './config/config';
import swaggerSpec from './swagger';
import { Limiter } from './utils';
import log from './utils/logger';

export function createApp(): Express {
  const app: Express = express();

  app.options('*', cors());
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Authorization'],
    }),
  );

  app.use(Limiter);
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'Welcome to Mono Bank API' });
  });
  app.get('/api/v1', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to Mono Bank API' });
  });

  app.use('/api/v1/auth', auth);
  app.use('/api/v1/accounts', account);
  app.use('/api/v1/transactions', transaction);

  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/v1/api.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  return app;
}

export async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.MONGO_URI as string);
    log.info('Connected to MongoDB');
  } catch (err) {
    log.error('MongoDB connection error:', err);
    throw err;
  }
}

if (require.main === module) {
  const PORT = config.PORT || 3000;

  const app = createApp();

  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        log.info(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      log.error('Failed to start the server:', err);
      process.exit(1);
    });
}
