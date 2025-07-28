import * as mongoDB from 'mongodb';
import { config } from '../config';
import type { Blogs } from '../models/blogs.model';
import type { Posts } from '../models/posts.model';
import type { Session } from '../models/session.model';
import type { Tags } from '../models/tags.model';
import type { Users } from '../models/users.model';
import { logger } from './winston';

export const collections: {
  users?: mongoDB.Collection<Users>;
  session?: mongoDB.Collection<Session>;
  blogs?: mongoDB.Collection<Blogs>;
  posts?: mongoDB.Collection<Posts>;
  tags?: mongoDB.Collection<Tags>;
} = {};

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
