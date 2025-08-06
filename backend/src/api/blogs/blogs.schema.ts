import { z } from 'zod';

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

export const updateBlogSchema = z.object({
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
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
  params: z.object({
    blogId: z.string(),
  }),
});

export type TCreateNewBlogRequestBody = z.infer<
  typeof createNewBlogSchema
>['body'];
export type TGetAllBlogsQueryParams = z.infer<
  typeof getAllBlogsSchema
>['query'];
export type TUpdateBlogRequestBody = z.infer<typeof updateBlogSchema>['body'];
export type TUpdateBlogParams = z.infer<typeof updateBlogSchema>['params'];
export type TDeleteBlogParams = z.infer<typeof deleteBlogSchema>['params'];
export type TCreateNewTagParams = z.infer<typeof createNewTagSchema>['params'];
export type TCreateNewTagRequestBody = z.infer<
  typeof createNewTagSchema
>['body'];
