import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const getPublicBlogSchema = z.object({
  query: z
    .object({
      blog: z.string().trim(),
    })
    .strict(),
});

export const getPublicPostsSchema = z.object({
  query: z
    .object({
      blog: z.string().trim(),
      query: z.string().optional(),
      limit: z.coerce
        .number()
        .min(1, { message: 'limit must be at least 1' })
        .max(1000, { message: 'limit must be at most 1000' })
        .transform((val) => String(val))
        .optional(),
      page: z.coerce
        .number()
        .min(1, { message: 'page must be at least 1' })
        .max(1000, { message: 'page must be at most 1000' })
        .transform((val) => String(val))
        .optional(),
      category: z.string().optional(),
    })
    .strict(),
});

export const getPublicPostSchema = z.object({
  params: z
    .object({
      postSlug: z.string().trim(),
    })
    .strict(),
  query: z
    .object({
      blog: z.string().trim(),
    })
    .strict(),
});

export const getPublicPreviewPostSchema = z.object({
  params: z
    .object({
      postId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
    })
    .strict(),
  query: z
    .object({
      blog: z.string().trim(),
    })
    .strict(),
});

export const getPublicCategoriesSchema = z.object({
  query: z
    .object({
      blog: z.string().trim(),
    })
    .strict(),
});

export type GetPublicBlogQuery = z.infer<typeof getPublicBlogSchema>['query'];
export type GetPublicPostsQuery = z.infer<typeof getPublicPostsSchema>['query'];
export type GetPublicPostQuery = z.infer<typeof getPublicPostSchema>['query'];
export type GetPublicPostParms = z.infer<typeof getPublicPostSchema>['params'];
export type GetPublicCategoriesQuery = z.infer<typeof getPublicCategoriesSchema>['query'];
export type GetPublicPreviewPostParms = z.infer<typeof getPublicPreviewPostSchema>['params'];
export type GetPublicPreviewPostQuery = z.infer<typeof getPublicPreviewPostSchema>['query'];
