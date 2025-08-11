import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { PostStatus } from '../../db/schema';

export const createPostSchema = z.object({
  body: z
    .object({
      blogId: z.string().trim().refine(val => ObjectId.isValid(val), {
        message: "Invalid mongodb objectid"
      }),
    })
    .strict(),
});

export const getAllPostsSchema = z.object({
  query: z
    .object({
      blogId: z.string().trim().refine(val => ObjectId.isValid(val), {
        message: "Invalid mongodb objectid"
      }),
      q: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      limit: z.coerce.number().optional().default(10),
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
      postId: z.string().trim().refine(val => ObjectId.isValid(val), {
        message: "Invalid mongodb objectid"
      }),
    })
    .strict(),
});

export const editPostSchema = z.object({
  body: z
    .object({
      title: z.union([z.string(), z.undefined()]).transform(val => {
        if (val === undefined) return null;
        const trimmedValue = val.trim();
        return trimmedValue === "" ? null : trimmedValue
      }).nullable(),
      subTitle: z.union([z.string(), z.undefined()]).transform(val => {
        if (val === undefined) return null;
        const trimmedValue = val.trim();
        return trimmedValue === "" ? null : trimmedValue
      }).nullable(),
      content: z.union([z.string(), z.undefined()]).transform(val => {
        if (val === undefined) return null;
        const trimmedValue = val.trim();
        return trimmedValue === "" ? null : trimmedValue
      }).nullable(),
      coverImg: z.union([z.url(), z.undefined()]).transform(val => {
        if (val === undefined) return null;
        return val;
      }).nullable(),
      slug: z.union([z.string(), z.undefined()]).transform(val => {
        if (val === undefined) return null;
        const trimmedValue = val.trim();
        return trimmedValue === "" ? null : trimmedValue;
      }).refine(val => val && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(val), {
        message: "slug should only contains numbers, lowercase and hash character"
      }).nullable(),
      tags: z.union([z.undefined(), z.array(z.string().trim().refine(val => ObjectId.isValid(val), {
        message: "Invalid mongodb objectid"
      }))]).transform(val => {
        if (val === undefined) return null;
        return val;
      }).nullable(),
      postStatus: z.union([z.undefined(), z.enum(PostStatus)]).transform(val => {
        if (val === undefined) return null;
        return val;
      }).nullable(),
    })
    .strict(),
  params: z
    .object({
      postId: z.string().trim().refine(val => ObjectId.isValid(val), {
        message: "Invalid mongodb objectid"
      }),
    })
    .strict(),
});

export const deletePostSchema = z.object({
  params: z
    .object({
      postId: z.string().trim().refine(val => ObjectId.isValid(val), {
        message: "Invalid mongodb objectid"
      }),
    })
    .strict(),
});

export const addTagToPostSchema = z.object({
  body: z.object({
    tagId: z.string().trim().refine(val => ObjectId.isValid(val), {
      message: "Invalid mongodb objectid"
    }),
  }),
  params: z.object({
    postId: z.string().trim().refine(val => ObjectId.isValid(val), {
      message: "Invalid mongodb objectid"
    }),
  })
});

export const removeTagFromPostSchema = z.object({
  body: z.object({
    tagId: z.string().trim().refine(val => ObjectId.isValid(val), {
      message: "Invalid mongodb objectid"
    }),
  }),
  params: z.object({
    postId: z.string().trim().refine(val => ObjectId.isValid(val), {
      message: "Invalid mongodb objectid"
    }),
  })
})

export type TCreatePostParams = z.infer<typeof createPostSchema>['body'];
export type TGetAllPostsQuery = z.infer<typeof getAllPostsSchema>['query'];
export type TGetPostByIdParams = z.infer<typeof getPostByIdSchema>['params'];
export type TEditPostBody = z.infer<typeof editPostSchema>['body'];
export type TEditPostParams = z.infer<typeof editPostSchema>['params'];
export type TDeletePostParams = z.infer<typeof deletePostSchema>['params'];
export type TAddTagToPostBody = z.infer<typeof addTagToPostSchema>['body'];
export type TAddTagToPostParams = z.infer<typeof addTagToPostSchema>['params'];
export type TRemoveTagFromPostBody = z.infer<typeof removeTagFromPostSchema>['body'];
export type TRemoveTagFromPostParams = z.infer<typeof removeTagFromPostSchema>['params'];
