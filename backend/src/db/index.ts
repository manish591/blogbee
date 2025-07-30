import * as mongoDB from 'mongodb';
import { config } from '../config';
import { logger } from '../utils/logger';
import type { Blogs, Posts, Session, Tags, Users } from './schema';

export const collections: {
  users?: mongoDB.Collection<Users>;
  session?: mongoDB.Collection<Session>;
  blogs?: mongoDB.Collection<Blogs>;
  posts?: mongoDB.Collection<Posts>;
  tags?: mongoDB.Collection<Tags>;
} = {};

const client = new mongoDB.MongoClient(config.DATABASE_URL, {
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

    collections.users = db.collection<Users>('users');
    collections.session = db.collection<Session>('session');
    collections.blogs = db.collection<Blogs>('blogs');
    collections.posts = db.collection<Posts>('posts');
    collections.tags = db.collection<Tags>('tags');

    logger.info('Successfully Connected To The Database');
  } catch (err) {
    logger.error('Failed To Connect To The Database', err);
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  try {
    await client.close();

    logger.warn('Successfully Disconnected From The Database');
  } catch (err) {
    logger.error('Failed To Disconnect From The Database', err);
  }
}
