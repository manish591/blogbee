export interface User {
  _id?: string;
  name: string;
  email: string;
  profileImg?: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}