import type { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";

async function create(req: Request, res: Response, next: NextFunction) {
  const schema = z.object({
    name: z.string().min(5).max(30),
    email: z.email(),
    password: z.string().min(6).max(30)
  });

  try {
    await schema.parseAsync(req.body);

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({
        message: "Bad Request"
      });
    }

    next(err);
  }
}

export const usersValidator = {
  create
};
