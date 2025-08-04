import { z } from 'zod';

export const createNewBlogSchema = z
  .object({
    name: z
      .string()
      .min(5, {
        message: 'name should have atleast 5 characters',
      })
      .max(30, {
        message: 'name should not exceed 30 characters',
      }),
    about: z.string().optional(),
    slug: z
      .string()
      .min(5, {
        message: 'name should have atleast 5 characters',
      })
      .max(30, {
        message: 'name should not exceed 30 characters',
      })
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
        message:
          'name should only contain lowercase characters, numbers and hyphens',
      }),
  })
  .strict();

export type TCreateNewBlogRequestBody = z.infer<typeof createNewBlogSchema>;
