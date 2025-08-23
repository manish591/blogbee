import { type Collection, type Db, MongoClient, type MongoClientOptions, ServerApiVersion, type WithId } from 'mongodb';
import { config } from '../config';
import { logger } from '../utils/logger';
import { BlogbeeError } from '../utils/app-error';
import { POSTS_COLLECTION } from '../api/posts/posts.services';
import { BLOG_COLLECTION } from '../api/blogs/blogs.services';

let db: Db;
let mongoClient: MongoClient;

export async function connectToDatabase(
) {
  try {
    const dbClientOptions: MongoClientOptions = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
      },
    };

    mongoClient = new MongoClient(config.DB_URL, dbClientOptions);

    await mongoClient.connect();

    db = mongoClient.db(config.DB_NAME);

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
  } catch (err) {
    logger.error(
      'DB_CONNECTION_FAILED: Failed to connect to the database',
      err,
    );
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoClient.close();
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

export function getDB(): Db {
  if (!db) {
    throw new BlogbeeError(500, "Database not initialised");
  }

  return db;
}

export function getDBClient(): MongoClient {
  if (!mongoClient || !db) {
    throw new BlogbeeError(500, "Database not initialised");
  }

  return mongoClient;
}

export function collection<T>(collectionName: string): Collection<WithId<T>> {
  if (!db) {
    throw new BlogbeeError(500, "Database not initialised");
  }

  return db.collection<WithId<T>>(collectionName);
}