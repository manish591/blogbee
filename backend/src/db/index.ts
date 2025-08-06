import * as mongoDB from 'mongodb';
import { config } from '../config';
import { logger } from '../utils/logger';

export const dbClientOptions: mongoDB.MongoClientOptions = {
  serverApi: {
    version: mongoDB.ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

export function createDatabaseClient(
  databaseUri: string,
  options: mongoDB.MongoClientOptions = dbClientOptions,
) {
  return new mongoDB.MongoClient(databaseUri, options);
}

export async function connectToDatabase(
  client: mongoDB.MongoClient,
  databaseName: string,
) {
  try {
    await client.connect();

    const db: mongoDB.Db = client.db(databaseName);

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

export const dbClient = createDatabaseClient(config.DATABASE_URL);
