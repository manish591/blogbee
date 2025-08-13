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

export const getAllPostsSchema = z.object({
  query: z
    .object({
      blogId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
      q: z.string().optional().default(''),
      page: z.coerce.number().optional().default(1),
      limit: z.coerce.number().optional().default(10),
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
      title: z
        .union([z.string(), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          const trimmedValue = val.trim();
          return trimmedValue === '' ? undefined : trimmedValue;
        })
        .optional(),
      subTitle: z
        .union([z.string(), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          const trimmedValue = val.trim();
          return trimmedValue === '' ? undefined : trimmedValue;
        })
        .optional(),
      content: z
        .union([z.string(), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          const trimmedValue = val.trim();
          return trimmedValue === '' ? undefined : trimmedValue;
        })
        .optional(),
      coverImg: z
        .union([z.url(), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          return val.trim();
        })
        .optional(),
      slug: z
        .union([z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          const trimmedValue = val.trim();
          return trimmedValue === '' ? undefined : trimmedValue;
        })
        .optional(),
      postStatus: z
        .union([z.undefined(), z.enum(PostStatus)])
        .transform((val) => {
          if (val === undefined) return undefined;
          return val;
        })
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

export const addTagToPostSchema = z.object({
  params: z.object({
    postId: z
      .string()
      .trim()
      .refine((val) => ObjectId.isValid(val), {
        message: 'Invalid mongodb objectid',
      }),
    tagId: z
      .string()
      .trim()
      .refine((val) => ObjectId.isValid(val), {
        message: 'Invalid mongodb objectid',
      }),
  }),
});

export const removeTagFromPostSchema = z.object({
  params: z.object({
    postId: z
      .string()
      .trim()
      .refine((val) => ObjectId.isValid(val), {
        message: 'Invalid mongodb objectid',
      }),
    tagId: z
      .string()
      .trim()
      .refine((val) => ObjectId.isValid(val), {
        message: 'Invalid mongodb objectid',
      }),
  }),
});

export type TCreatePostBody = z.infer<typeof createPostSchema>['body'];
export type TGetAllPostsQuery = z.infer<typeof getAllPostsSchema>['query'];
export type TGetPostByIdParams = z.infer<typeof getPostByIdSchema>['params'];
export type TEditPostBody = z.infer<typeof editPostSchema>['body'];
export type TEditPostParams = z.infer<typeof editPostSchema>['params'];
export type TDeletePostParams = z.infer<typeof deletePostSchema>['params'];
export type TAddTagToPostParams = z.infer<typeof addTagToPostSchema>['params'];
export type TRemoveTagFromPostParams = z.infer<
  typeof removeTagFromPostSchema
>['params'];
