import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';
import { config } from '../config';

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

    console.log('Successfully connected to the database');
  } catch (err) {
    console.log('Failed to connect to the database', err);
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();

    console.log('Successfully disconnected from the database');
  } catch (err) {
    console.log('Failed to disconnect from the database', err);
  }
}
