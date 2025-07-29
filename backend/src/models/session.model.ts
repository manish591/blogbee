export interface Session {
  _id?: string;
  userId: string;
  sessionId: string;
  expiresIn: Date;
  createdAt: Date;
  updatedAt: Date;
}
