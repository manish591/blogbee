import { z } from 'zod';
import { PostStatus } from '../../db/schema';

export const createPostSchema = z.object({
  body: z
    .object({
      blogId: z.string(),
    })
    .strict(),
});

export const getAllPostsSchema = z.object({
  body: z
    .object({
      blogId: z.string(),
    })
    .strict(),
  query: z
    .object({
      q: z.string().optional(),
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      filter: z
        .string()
        .regex(/^(?!,)([a-z,]*[a-z])(?!,)$/, {
          message:
            'Only lowercase letters and commas allowed, comma cannot be at start or end',
        })
        .optional(),
    })
    .strict(),
});

export const getPostByIdSchema = z.object({
  params: z
    .object({
      postId: z.string(),
    })
    .strict(),
});

export const editPostSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      subTitle: z.string().optional(),
      content: z.string().optional(),
      coverImg: z.string().optional(),
      slug: z.string().optional(),
      tags: z.array(z.string()).optional(),
      postStatus: z.enum(PostStatus).optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
      if (data.postStatus === PostStatus.PUBLISHED && !data.slug) {
        ctx.addIssue({
          path: ['slug'],
          code: 'custom',
          message: 'Slug is required when post status is published',
        });
      }
    }),
  params: z
    .object({
      blogId: z.string(),
      postId: z.string(),
    })
    .strict(),
});

export const deletePostSchema = z.object({
  params: z
    .object({
      blogId: z.string(),
      postId: z.string(),
    })
    .strict(),
});

export type TCreatePostParams = z.infer<typeof createPostSchema>['body'];
export type TGetAllPostsBody = z.infer<typeof getAllPostsSchema>['body'];
export type TGetAllPostsQuery = z.infer<typeof getAllPostsSchema>['query'];
export type TGetPostByIdParams = z.infer<typeof getPostByIdSchema>['params'];
export type TEditPostBody = z.infer<typeof editPostSchema>['body'];
export type TEditPostParams = z.infer<typeof editPostSchema>['params'];
export type TDeletePostParams = z.infer<typeof deletePostSchema>['params'];
