import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { PostStatus } from '../../db/schema';

export const createPostSchema = z.object({
  body: z
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

export const getPostsSchema = z.object({
  query: z
    .object({
      blogId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
      query: z.string().optional().default(''),
      page: z.coerce
        .number()
        .min(1, { message: 'page must be at least 1' })
        .max(1000, { message: 'page must be at most 1000' })
        .transform((val) => String(val))
        .optional(),
      limit: z.coerce
        .number()
        .min(1, { message: 'limit must be at least 1' })
        .max(1000, { message: 'limit must be at most 1000' })
        .transform((val) => String(val))
        .optional(),
      categories: z
        .string()
        .regex(/^[A-Za-z0-9]+(?:,[A-Za-z0-9]+)*$/)
        .optional(),
      sort: z.union([z.literal('latest'), z.literal('oldest')]).optional(),
      status: z.enum(PostStatus).optional(),
    })
    .strict(),
});

export const getPostByIdSchema = z.object({
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
});

export const editPostSchema = z.object({
  body: z
    .object({
      title: z.string().trim().max(300).optional(),
      subTitle: z.string().max(300).optional(),
      content: z.string().optional(),
      coverImg: z.url().optional(),
      slug: z
        .string()
        .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
        .optional(),
      postStatus: z.enum(PostStatus).optional(),
      categories: z
        .string()
        .regex(/^[A-Za-z0-9]+(?:,[A-Za-z0-9]+)*$/)
        .optional(),
    })
    .strict(),
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
});

export const deletePostSchema = z.object({
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
});

export const addCategoryToPostSchema = z.object({
  params: z.object({
    postId: z
      .string()
      .trim()
      .refine((val) => ObjectId.isValid(val), {
        message: 'Invalid mongodb objectid',
      }),
    categoryId: z
      .string()
      .trim()
      .refine((val) => ObjectId.isValid(val), {
        message: 'Invalid mongodb objectid',
      }),
  }),
});

export const removeCategoryFromPostSchema = z.object({
  params: z.object({
    postId: z
      .string()
      .trim()
      .refine((val) => ObjectId.isValid(val), {
        message: 'Invalid mongodb objectid',
      }),
    categoryId: z
      .string()
      .trim()
      .refine((val) => ObjectId.isValid(val), {
        message: 'Invalid mongodb objectid',
      }),
  }),
});

export type CreatePostBody = z.infer<typeof createPostSchema>['body'];
export type GetPostsQuery = z.infer<typeof getPostsSchema>['query'];
export type GetPostByIdParams = z.infer<typeof getPostByIdSchema>['params'];
export type EditPostBody = z.infer<typeof editPostSchema>['body'];
export type EditPostParams = z.infer<typeof editPostSchema>['params'];
export type DeletePostParams = z.infer<typeof deletePostSchema>['params'];
export type AddCategoryToPostParams = z.infer<
  typeof addCategoryToPostSchema
>['params'];
export type RemoveCategoryFromPostParams = z.infer<
  typeof removeCategoryFromPostSchema
>['params'];
