import type { Db } from 'mongodb';

declare global {
  namespace Express {
    interface Locals {
      user?: {
        userId: string;
        sessionId: string;
      };
    }

    interface Request {
      db: Db;
    }
  }
}
