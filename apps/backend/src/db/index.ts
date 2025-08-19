import * as mongoDB from 'mongodb';
import { config } from '../config';
import { BLOG_COLLECTION, POSTS_COLLECTION } from '../utils/constants';
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
  logger.info('CREATE_DATABASE_CLIENT', databaseUri);
  return new mongoDB.MongoClient(databaseUri, options);
}

export async function connectToDatabase(
  client: mongoDB.MongoClient,
  databaseName: string,
) {
  try {
    await client.connect();
    const db: mongoDB.Db = client.db(databaseName);
    await db.collection(BLOG_COLLECTION).createIndex({
      name: 'text',
      slug: 'text',
    });
    await db.collection(POSTS_COLLECTION).createIndex({
      title: 'text',
      slug: 'text',
    });
    logger.info(
      'DB_CONNECTION_SUCCESS: Successfully connected to the database',
    );

    return db;
  } catch (err) {
    logger.error(
      'DB_CONNECTION_FAILED: Failed to connect to the database',
      err,
    );
    process.exit(1);
  }
}

export async function disconnectFromDatabase(client: mongoDB.MongoClient) {
  try {
    await client.close();
    logger.warn(
      'DB_DISCONNECT_SUCCESS: Successfully disconnected from the database',
    );
  } catch (err) {
    logger.error(
      'DB_DISCONNECT_FAILED: Failed to disconnect from the database',
      err,
    );
  }
}

export const dbClient = createDatabaseClient(config.DATABASE_URL);
