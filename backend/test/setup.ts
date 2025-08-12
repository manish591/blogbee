import {
  MongoDBContainer,
  type StartedMongoDBContainer,
} from '@testcontainers/mongodb';
import type * as mongo from 'mongodb';
import { afterAll, beforeAll, beforeEach } from 'vitest';
import { config } from '../src/config';
import {
  connectToDatabase,
  createDatabaseClient,
  disconnectFromDatabase,
} from '../src/db';
import { BLOG_COLLECTION, POSTS_COLLECTION } from '../src/utils/constants';

let db: mongo.Db;
let dbClient: mongo.MongoClient;
let mongodbContainer: StartedMongoDBContainer;

const timeout = 60_000;

beforeAll(async () => {
  mongodbContainer = await new MongoDBContainer('mongo:8.0.12').start();
  dbClient = createDatabaseClient(
    `${mongodbContainer.getConnectionString()}/?directConnection=true`,
    {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    },
  );
  db = await connectToDatabase(dbClient, config.TEST_DATABASE_NAME);
}, timeout);

beforeEach(async () => {
  // clean up db with fresh data
  await db.dropDatabase();
  await db.collection(BLOG_COLLECTION).createIndex({
    name: "text",
    slug: "text"
  });
  await db.collection(POSTS_COLLECTION).createIndex({
    title: "text",
    slug: "text",
  });
}, timeout);

afterAll(async () => {
  // close the db connections
  await disconnectFromDatabase(dbClient);
  await mongodbContainer?.stop();
}, timeout);

export { db };
