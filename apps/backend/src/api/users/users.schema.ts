import { z } from 'zod';

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().max(30),
      email: z.email().trim(),
      password: z.string().min(6).max(30),
    })
    .strict(),
});

export const loginUserSchema = z.object({
  body: z
    .object({
      email: z.email().trim(),
      password: z.string().min(6).max(30),
    })
    .strict(),
});

export const editUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().max(30).optional(),
      profileImg: z.url().optional(),
    })
    .strict(),
});

export type CreateUserBody = z.infer<typeof createUserSchema>['body'];
export type LoginUserBody = z.infer<typeof loginUserSchema>['body'];
export type EditUserBody = z.infer<typeof editUserSchema>['body'];
