import * as mongoDB from 'mongodb';
import { config } from '../config';
import { logger } from './winston';
import { Users } from '../models/users.model';
import { Session } from '../models/session.model';
import { Blogs } from '../models/blogs.model';
import { Posts } from '../models/posts.model';
import { Tags } from '../models/tags.model';

export const collections: {
  users?: mongoDB.Collection<Users>
  session?: mongoDB.Collection<Session>
  blogs?: mongoDB.Collection<Blogs>
  posts?: mongoDB.Collection<Posts>
  tags?: mongoDB.Collection<Tags>
} = {}

export const client = new mongoDB.MongoClient(config.DATABASE_URL, {
  serverApi: {
    version: mongoDB.ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectToDatabase() {
  try {
    await client.connect();

    const db: mongoDB.Db = client.db(config.DATABASE_NAME);

    collections.users = db.collection<Users>("users");
    collections.session = db.collection<Session>("session");
    collections.blogs = db.collection<Blogs>("blogs");
    collections.posts = db.collection<Posts>("posts");
    collections.tags = db.collection<Tags>("tags");

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