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
  subTitle?: string;
  content: string;
  slug: string;
  postStatus: PostStatus
  category: {
    _id?: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}