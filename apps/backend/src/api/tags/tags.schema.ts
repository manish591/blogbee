import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const createTagSchema = z.object({
  body: z
    .object({
      blogId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
      name: z.string().trim().max(30, {
        message: 'tag length should not exceed 30 characters',
      }),
      description: z
        .union([z.string(), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          const trimmedValue = val.trim();
          return trimmedValue === '' ? undefined : trimmedValue;
        })
        .optional(),
    })
    .strict(),
});

export const getBlogTagsSchema = z.object({
  query: z
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

export const editTagSchema = z.object({
  body: z
    .object({
      name: z
        .union([z.string(), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          const trimmedValue = val.trim();
          return trimmedValue === '' ? undefined : trimmedValue;
        })
        .optional(),
      description: z
        .union([z.string(), z.undefined()])
        .transform((val) => {
          if (val === undefined) return undefined;
          const trimmedValue = val.trim();
          return trimmedValue === '' ? undefined : trimmedValue;
        })
        .optional(),
    })
    .strict(),
  params: z
    .object({
      tagId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
    })
    .strict(),
});

export const deleteTagSchema = z.object({
  params: z
    .object({
      tagId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
    })
    .strict(),
});

export type TCreateTagBody = z.infer<typeof createTagSchema>['body'];
export type TGetAllTagsParams = z.infer<typeof getBlogTagsSchema>['query'];
export type TEditTagParams = z.infer<typeof editTagSchema>['params'];
export type TEditTagBody = z.infer<typeof editTagSchema>['body'];
export type TDeleteTagParams = z.infer<typeof deleteTagSchema>['params'];
