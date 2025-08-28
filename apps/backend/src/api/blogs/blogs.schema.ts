import { ObjectId } from 'mongodb';
import { z, ZodError } from 'zod';

export const createBlogSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .transform((val) => val.trim())
        .refine((val) => val.length >= 5 && val.length <= 30, {
          message:
            'name should be greater than 5 characters and less than 30 characters',
        }),
      about: z
        .union([z.string(), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          const trimmedValue = val.trim();
          return trimmedValue === '' ? undefined : trimmedValue;
        })
        .optional(),
      slug: z
        .string()
        .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
          message:
            'name should only contain lowercase characters, numbers and hyphens',
        })
        .transform((val) => val.trim())
        .refine((val) => val.length >= 5 && val.length <= 30, {
          message: 'slug must be between 5 and 30 characters',
        }),
      logo: z
        .union([z.url(), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          return val.trim();
        })
        .optional(),
    })
    .strict(),
});

export const getAllBlogsByUserSchema = z.object({
  query: z
    .object({
      query: z.string().optional(),
      page: z.coerce.number().nonnegative().max(1000).optional().default(1),
      limit: z.string().transform((val) => {
        if (val.trim() === "") {
          throw new ZodError([
            {
              code: "custom",
              path: ["limit"],
              message: "limit cannot be empty"
            }
          ]);
        }

        const num = Number(val);

        if (Number.isNaN(num)) {
          throw new ZodError([
            {
              code: "custom",
              path: ["limit"],
              message: "limit must be a number"
            }
          ]);
        }

        return num;
      }).refine((val) => val >= 1, {
        message: "limit must be greater than or equal to zero"
      }).optional(),
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
      name: z
        .union([
          z
            .string()
            .refine((val) => val && val.length >= 5 && val.length <= 30, {
              message:
                'name should be greater than 5 characters and less than 30 characters',
            }),
          z.undefined(),
        ])
        .transform((val) => {
          if (val === undefined) return undefined;
          const trimmedValue = val.trim();
          return trimmedValue === '' ? undefined : trimmedValue;
        })
        .optional(),
      about: z
        .union([z.string(), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          const trimmedValue = val.trim();
          return trimmedValue === '' ? undefined : trimmedValue;
        })
        .optional(),
      logo: z
        .union([z.url(), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          return val.trim();
        })
        .optional(),
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

export type TCreateBlogBody = z.infer<typeof createBlogSchema>['body'];
export type TGetAllBlogsQuery = z.infer<
  typeof getAllBlogsByUserSchema
>['query'];
export type TGetBlogByIdParams = z.infer<typeof getBlogByIdSchema>['params'];
export type TEditBlogBody = z.infer<typeof editBlogSchema>['body'];
export type TEditBlogParams = z.infer<typeof editBlogSchema>['params'];
export type TDeleteBlogParams = z.infer<typeof deleteBlogSchema>['params'];
