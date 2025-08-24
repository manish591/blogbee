import {
  MongoDBContainer,
  type StartedMongoDBContainer,
} from '@testcontainers/mongodb';
import { type Collection, type Db, MongoClient, type WithId } from 'mongodb';
import { afterAll, beforeAll, beforeEach, vi } from 'vitest';
import { BLOG_COLLECTION } from '../src/api/blogs/blogs.services';
import { POSTS_COLLECTION } from '../src/api/posts/posts.services';
import { config } from '../src/config';

let mongodbContainer: StartedMongoDBContainer;
let db: Db;
let dbClient: MongoClient;

const timeout = 60_000;

beforeAll(async () => {
  mongodbContainer = await new MongoDBContainer('mongo:8.0.12').start();
  const connectionStr = `${mongodbContainer.getConnectionString()}/?directConnection=true`;
  process.env.TEST_DB_URL = connectionStr;
  config.TEST_DB_URL = connectionStr;

  dbClient = new MongoClient(config.TEST_DB_URL);
  await dbClient.connect();
  db = dbClient.db(config.TEST_DB_NAME);

  vi.mock('../src/db', () => ({
    getDB: (): Db => db,
    getDBClient: (): MongoClient => dbClient,
    collection: <T>(collectionName: string): Collection<WithId<T>> =>
      db.collection<WithId<T>>(collectionName),
  }));
}, timeout);

beforeEach(async () => {
  // clean up db with fresh data
  await db.dropDatabase();
  await db.collection(BLOG_COLLECTION).createIndex({
    name: 'text',
    slug: 'text',
  });
  await db.collection(POSTS_COLLECTION).createIndex({
    title: 'text',
    slug: 'text',
  });
}, timeout);

afterAll(async () => {
  // close the db connections
  await dbClient.close();
  await mongodbContainer?.stop();
}, timeout);
