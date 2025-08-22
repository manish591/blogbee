import * as db from "../src/db";
import { buildServer } from './app';
import { config } from './config';
import { logger } from './utils/logger';

(async () => {
  try {
    await db.connectToDatabase();
    const app = buildServer();

    const server = app.listen(config.PORT, () => {
      logger.info(`Server running at: http://localhost:${config.PORT}`);
    });

    process.on('SIGTERM', () => {
      server.close(async () => {
        await db.disconnectFromDatabase();
        logger.warn('Server Shutdown');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      server.close(async () => {
        await db.disconnectFromDatabase();
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
