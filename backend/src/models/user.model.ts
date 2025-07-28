export enum UserRole {
  USER,
  ADMIN
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  profileImg?: string;
  password: string;
  userRole: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}