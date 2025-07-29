declare global {
  namespace Express {
    interface Locals {
      user?: {
        userId: string;
      };
    }
  }
}

export {};
