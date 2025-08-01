import * as mongoDB from 'mongodb';
import { config } from '../config';
import { logger } from '../utils/logger';

export const dbClientOptions: mongoDB.MongoClientOptions = {
  serverApi: {
    version: mongoDB.ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

export function createDatabaseClient(databaseUri: string) {
  return new mongoDB.MongoClient(databaseUri, dbClientOptions);
}

export async function connectToDatabase(client: mongoDB.MongoClient) {
  try {
    await client.connect();

    const db: mongoDB.Db = client.db(config.DATABASE_NAME);

    logger.info('Successfully Connected To The Database');

    return db;
  } catch (err) {
    logger.error('Failed To Connect To The Database', err);
    process.exit(1);
  }
}

export async function disconnectFromDatabase(client: mongoDB.MongoClient) {
  try {
    await client.close();

    logger.warn('Successfully Disconnected From The Database');
  } catch (err) {
    logger.error('Failed To Disconnect From The Database', err);
  }
}
