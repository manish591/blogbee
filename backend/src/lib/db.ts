import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from './winston';

const clientOptions: ConnectOptions = {
  dbName: 'writely-db',
  appName: 'writely',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export async function connectToDatabase() {
  try {
    if (!config.DATABASE_URL) {
      throw new Error('Database URI cannot be empty');
    }

    await mongoose.connect(config.DATABASE_URL, clientOptions);

    logger.info('Successfully connected to the database');
  } catch (err) {
    logger.error('Failed to connect to the database', err);
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();

    logger.warn('Successfully disconnected from the database');
  } catch (err) {
    logger.error('Failed to disconnect from the database', err);
  }
}
