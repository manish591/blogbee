import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(5).max(30),
  email: z.email(),
  password: z.string().min(6).max(30),
});

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(30),
});

export type TCreateUserRequestBody = z.infer<typeof createUserSchema>;
export type TLoginUserRequestBody = z.infer<typeof loginUserSchema>;
