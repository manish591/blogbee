export interface Tags {
  _id?: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Users {
  _id?: string;
  name: string;
  email: string;
  profileImg?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  _id?: string;
  userId: string;
  sessionId: string;
  expiresIn: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostStatus {
  DRAFT,
  PUBLISHED,
  ARCHIVED,
}

export interface Tags {
  _id?: string;
  name: string;
  blogId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Posts {
  _id?: string;
  userId: string;
  blogId: string;
  title: string;
  subTitle?: string;
  content: string;
  slug: string;
  postStatus: PostStatus;
  tags: Tags[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Blogs {
  _id?: string;
  userId: string;
  name: string;
  about?: string;
  slug: string;
  blogLogo?: string;
  createdAt: Date;
  updatedAt: Date;
}
