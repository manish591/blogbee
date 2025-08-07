import { z } from 'zod';
import { PostStatus } from '../../db/schema';

export const createNewBlogSchema = z.object({
  body: z
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
      blogLogo: z.url({ message: 'Logo should be a valid url' }).optional(),
    })
    .strict(),
});

export const getAllBlogsSchema = z.object({
  query: z
    .object({
      query: z.string().optional().default(''),
      page: z.coerce.number().optional().default(0),
      limit: z.coerce.number().optional().default(10),
    })
    .strict(),
});

export const editBlogSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(5, {
          message: 'name should have atleast 5 characters',
        })
        .max(30, {
          message: 'name should not exceed 30 characters',
        })
        .optional(),
      about: z.string().optional(),
      blogLogo: z
        .url({ message: 'Blog logo should be a valid url' })
        .optional(),
    })
    .strict(),
  params: z
    .object({
      blogId: z.string(),
    })
    .strict(),
});

export const deleteBlogSchema = z.object({
  params: z
    .object({
      blogId: z.string(),
    })
    .strict(),
});

export const createNewTagSchema = z.object({
  body: z
    .object({
      name: z.string(),
      description: z.string().optional(),
    })
    .strict(),
  params: z
    .object({
      blogId: z.string(),
    })
    .strict(),
});

export const getAllTagsSchema = z.object({
  params: z
    .object({
      blogId: z.string(),
    })
    .strict(),
});

export const editTagsSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
    })
    .strict(),
  params: z
    .object({
      blogId: z.string(),
      tagId: z.string(),
    })
    .strict(),
});

export const deleteTagsSchema = z.object({
  params: z
    .object({
      blogId: z.string(),
      tagId: z.string(),
    })
    .strict(),
});

export const createPostsSchema = z.object({
  params: z.object({
    blogId: z.string(),
  }).strict()
});

export const getPostsSchema = z.object({
  params: z.object({
    blogId: z.string(),
  }).strict(),
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    filter: z.string().regex(/^(?!,)([a-z,]*[a-z])(?!,)$/, {
      message: "Only lowercase letters and commas allowed, comma cannot be at start or end",
    }).optional()
  }).strict()
});

export const editPostSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    subTitle: z.string().optional(),
    content: z.string().optional(),
    coverImg: z.string().optional(),
    slug: z.string().optional(),
    tags: z.array(z.string()).optional(),
    postStatus: z.enum(PostStatus).optional()
  }).strict().superRefine((data, ctx) => {
    if (data.postStatus === PostStatus.PUBLISHED && !data.slug) {
      ctx.addIssue({
        path: ["slug"],
        code: "custom",
        message: "Slug is required when post status is published"
      })
    }
  }),
  params: z.object({
    blogId: z.string(),
    postId: z.string()
  }).strict()
});

export const deletePostsSchema = z.object({
  params: z.object({
    blogId: z.string(),
    postId: z.string()
  }).strict()
});

export type TCreateNewBlogRequestBody = z.infer<
  typeof createNewBlogSchema
>['body'];
export type TGetAllBlogsQueryParams = z.infer<
  typeof getAllBlogsSchema
>['query'];
export type TEditBlogRequestBody = z.infer<typeof editBlogSchema>['body'];
export type TEditBlogParams = z.infer<typeof editBlogSchema>['params'];
export type TDeleteBlogParams = z.infer<typeof deleteBlogSchema>['params'];
export type TCreateNewTagParams = z.infer<typeof createNewTagSchema>['params'];
export type TCreateNewTagRequestBody = z.infer<
  typeof createNewTagSchema
>['body'];
export type TGetAllTagsParams = z.infer<typeof getAllTagsSchema>['params'];
export type TEditTagsParams = z.infer<typeof editTagsSchema>['params'];
export type TEditTagsRequestBody = z.infer<typeof editBlogSchema>['body'];
export type TDeleteTagsParams = z.infer<typeof deleteTagsSchema>['params'];
export type TCreatePostParams = z.infer<typeof createPostsSchema>['params'];
export type TGetPostsParams = z.infer<typeof getPostsSchema>['params'];
export type TGetPostsQuery = z.infer<typeof getPostsSchema>['query'];
export type TEditPostRequestBody = z.infer<typeof editPostSchema>['body'];
export type TEditPostParams = z.infer<typeof editPostSchema>['params'];
export type TDeletePostParams = z.infer<typeof deletePostsSchema>['params'];