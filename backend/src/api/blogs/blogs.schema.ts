import { z } from 'zod';

export const createBlogSchema = z.object({
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
      logo: z.url({ message: 'Logo should be a valid url' }).optional(),
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

export const getBlogByIdSchema = z.object({
  params: z
    .object({
      blogId: z.string(),
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

export type TCreateBlogBody = z.infer<typeof createBlogSchema>['body'];
export type TGetAllBlogsQuery = z.infer<typeof getAllBlogsSchema>['query'];
export type TEditBlogBody = z.infer<typeof editBlogSchema>['body'];
export type TEditBlogParams = z.infer<typeof editBlogSchema>['params'];
export type TDeleteBlogParams = z.infer<typeof deleteBlogSchema>['params'];
