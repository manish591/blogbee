import { z } from 'zod';

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(5).max(30),
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

export const editUserProfileSchema = z.object({
  body: z
    .object({
      name: z.union([z.string(), z.undefined()]).transform(val => {
        if (val === undefined) return null;
        const trimmedValue = val.trim();
        return trimmedValue === "" ? null : trimmedValue;
      }).refine(val => val && val.length >= 6 && val.length <= 30, {
        message: "name should be between 6 and 30 characters long"
      }).nullable(),
      profileImg: z.union([z.undefined(), z.url()]).transform(val => {
        if (val === undefined) return null;
        return val.trim();
      }).nullable(),
    })
    .strict(),
});

export type TCreateUserBody = z.infer<typeof createUserSchema>['body'];
export type TLoginUserBody = z.infer<typeof loginUserSchema>['body'];
export type TEditUserProfileBody = z.infer<
  typeof editUserProfileSchema
>['body'];
