declare global {
  namespace Express {
    interface Locals {
      user?: {
        userId: string;
        sessionId: string;
      };
    }
  }
}

export {};
