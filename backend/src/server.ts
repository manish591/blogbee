import { buildServer } from './app';
import { config } from './config';
import {
  connectToDatabase,
  createDatabaseClient,
  disconnectFromDatabase,
} from './db';
import { logger } from './utils/logger';

(async () => {
  try {
    const dbClient = createDatabaseClient(config.DATABASE_URL);
    const db = await connectToDatabase(dbClient, config.DATABASE_NAME);

    const app = buildServer({ db });

    const server = app.listen(config.PORT, () => {
      logger.info(`Server running at: http://localhost:${config.PORT}`);
    });

    process.on('SIGTERM', () => {
      server.close(async () => {
        await disconnectFromDatabase(dbClient);
        logger.warn('Server Shutdown');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      server.close(async () => {
        await disconnectFromDatabase(dbClient);
        logger.warn('Server Shutdown');
        process.exit(0);
      });
    });
  } catch (err) {
    logger.error('Failed to start the server', err);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();
