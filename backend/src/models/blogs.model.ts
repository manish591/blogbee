export interface Blogs {
  _id?: string;
  userId: string;
  name: string;
  about?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
