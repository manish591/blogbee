export interface Session {
  _id?: string;
  userId: string;
  sessionId: string;
  expiresIn: Date;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
