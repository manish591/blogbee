import type { ObjectId } from 'mongodb';

export interface Users {
  _id?: ObjectId;
  name: string;
  email: string;
  profileImg?: string;
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
  about?: string;
  slug: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tags {
  _id?: ObjectId;
  name: string;
  description?: string;
  blogId: ObjectId;
  userId: ObjectId;
  posts: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Posts {
  _id?: ObjectId;
  userId: ObjectId;
  blogId: ObjectId;
  title: string;
  postStatus: PostStatus;
  tags?: ObjectId[];
  slug?: string;
  subTitle?: string;
  content?: string;
  coverImg?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostStatus {
  DRAFT,
  PUBLISHED,
  ARCHIVED,
}
