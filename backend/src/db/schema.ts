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

export interface Tags {
  _id?: ObjectId;
  name: string;
  description?: string | null;
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
  postStatus: PostStatus;
  title: string;
  tags?: ObjectId[];
  slug?: string;
  subTitle?: string;
  content?: string;
  coverImg?: string;
  updatedAt: Date;
  createdAt: Date;
}

export enum PostStatus {
  DRAFT,
  PUBLISHED,
  ARCHIVED,
}
