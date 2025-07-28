export enum PostStatus {
  DRAFT,
  PUBLISHED,
  ARCHIVED
}

export interface Posts {
  _id?: string;
  userId: string;
  blogId: string;
  title: string;
  content: string;
  slug: string;
  postStatus: PostStatus
  createdAt: Date;
  updatedAt: Date;
}