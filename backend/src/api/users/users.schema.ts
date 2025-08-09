import { z } from 'zod';

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string().min(5).max(30),
      email: z.email(),
      password: z.string().min(6).max(30),
    })
    .strict(),
});

export const loginUserSchema = z.object({
  body: z
    .object({
      email: z.email(),
      password: z.string().min(6).max(30),
    })
    .strict(),
});

export const editUserProfileSchema = z.object({
  body: z
    .object({
      name: z.string().min(5).max(30).optional(),
      profileImg: z.url().optional(),
    })
    .strict(),
});

export type TCreateUserBody = z.infer<typeof createUserSchema>['body'];
export type TLoginUserBody = z.infer<typeof loginUserSchema>['body'];
export type TEditUserProfileBody = z.infer<
  typeof editUserProfileSchema
>['body'];
