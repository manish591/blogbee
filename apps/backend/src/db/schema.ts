import type { ObjectId } from 'mongodb';

export interface Users {
  _id?: ObjectId;
  name: string;
  email: string;
  profileImg?: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  _id?: ObjectId;
  userId: ObjectId;
  sessionId: string;
  expiresIn: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Blogs {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  about?: string | null;
  slug: string;
  logo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Categories {
  _id?: ObjectId;
  name: string;
  description?: string | null;
  blogId: ObjectId;
  userId: ObjectId;
  posts: {
    id: ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Posts {
  _id?: ObjectId;
  userId: ObjectId;
  blogId: ObjectId;
  postStatus: PostStatus;
  slug?: string;
  categories: {
    id: ObjectId;
    name: string;
  }[];
  title: string;
  subTitle?: string;
  content?: string;
  coverImg?: string;
  updatedAt: Date;
  createdAt: Date;
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}
