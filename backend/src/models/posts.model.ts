export enum PostStatus {
  DRAFT,
  PUBLISHED,
  ARCHIVED,
}

export interface Tag {
  _id?: string;
  name: string;
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
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}
