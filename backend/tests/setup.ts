import {
  MongoDBContainer,
  type StartedMongoDBContainer,
} from '@testcontainers/mongodb';
import type * as mongo from 'mongodb';
import { afterAll, beforeAll, beforeEach } from 'vitest';
import {
  connectToDatabase,
  createDatabaseClient,
  disconnectFromDatabase,
} from '../src/db';

let db: mongo.Db;
let dbClient: mongo.MongoClient;
let container: StartedMongoDBContainer;

const timeout = 30_000;

beforeAll(async () => {
  // start the mongo container first and connect to the database
  container = await new MongoDBContainer('mongo').start();
  const DATABASE_URI = container.getConnectionString();
  dbClient = createDatabaseClient(DATABASE_URI);

  db = await connectToDatabase(dbClient);
}, timeout);

beforeEach(async () => {
  // clean up db with fresh data
  await db.dropDatabase();
}, timeout);

afterAll(async () => {
  // close the db connections
  await disconnectFromDatabase(dbClient);
  await container?.stop();
}, timeout);

export { db };
