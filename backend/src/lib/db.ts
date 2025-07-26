import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from '../config';
import { logger } from './winston';

export const client = new MongoClient(config.DATABASE_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectToDatabase() {
  try {
    await client.connect();

    logger.info('Successfully connected to the database');
  } catch (err) {
    logger.error('Failed to connect to the database', err);
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  try {
    await client.close();

    logger.warn('Successfully disconnected from the database');
  } catch (err) {
    logger.error('Failed to disconnect from the database', err);
  }
}
