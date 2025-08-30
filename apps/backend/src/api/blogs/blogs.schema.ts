import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const createBlogSchema = z.object({
  body: z
    .object({
      name: z.string().trim().max(30),
      about: z.string().trim().max(300).optional(),
      slug: z
        .string()
        .trim()
        .max(30)
        .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
          message:
            'name should only contain lowercase characters, numbers and hyphens',
        }),
      logo: z.url().optional(),
    })
    .strict(),
});

export const getBlogsSchema = z.object({
  query: z
    .object({
      query: z.string().optional(),
      page: z.coerce
        .number()
        .min(1, { message: 'page must be at least 1' })
        .max(1000, { message: 'page must be at most 1000' })
        .transform((val) => String(val))
        .optional(),
      limit: z.coerce
        .number()
        .min(1, { message: 'limit must be at least 1' })
        .max(20, { message: 'limit must be at most 20' })
        .transform((val) => String(val))
        .optional(),
      sort: z.union([z.literal('latest'), z.literal('oldest')]).optional(),
    })
    .strict(),
});

export const getBlogByIdSchema = z.object({
  params: z
    .object({
      blogId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
    })
    .strict(),
});

export const editBlogSchema = z.object({
  body: z
    .object({
      name: z.string().trim().max(30).optional(),
      about: z.string().trim().max(300).optional(),
      logo: z.url().optional(),
    })
    .strict(),
  params: z
    .object({
      blogId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
    })
    .strict(),
});

export const deleteBlogSchema = z.object({
  params: z
    .object({
      blogId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
    })
    .strict(),
});

export type CreateBlogBody = z.infer<typeof createBlogSchema>['body'];
export type GetBlogsQuery = z.infer<typeof getBlogsSchema>['query'];
export type GetBlogByIdParams = z.infer<typeof getBlogByIdSchema>['params'];
export type EditBlogBody = z.infer<typeof editBlogSchema>['body'];
export type EditBlogParams = z.infer<typeof editBlogSchema>['params'];
export type DeleteBlogParams = z.infer<typeof deleteBlogSchema>['params'];
