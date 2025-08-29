import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z
    .object({
      blogId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
      name: z.string().trim().max(30, {
        message: 'category length should not exceed 30 characters',
      }).regex(/^[a-z0-9 ]+$/),
      description: z
        .string()
        .max(300)
        .optional(),
    })
    .strict(),
});

export const getCategoriesSchema = z.object({
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

export const editCategorySchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .max(30)
        .regex(/^[a-z0-9 ]+$/)
        .optional(),
      description: z
        .string()
        .max(300)
        .optional(),
    })
    .strict(),
  params: z
    .object({
      categoryId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
    })
    .strict(),
});

export const deleteCategorySchema = z.object({
  params: z
    .object({
      categoryId: z
        .string()
        .trim()
        .refine((val) => ObjectId.isValid(val), {
          message: 'Invalid mongodb objectid',
        }),
    })
    .strict(),
});

export type CreateCategoryBody = z.infer<typeof createCategorySchema>['body'];
export type GetAllCategoriesParams = z.infer<typeof getCategoriesSchema>['query'];
export type EditCategoryParams = z.infer<typeof editCategorySchema>['params'];
export type EditCategoryBody = z.infer<typeof editCategorySchema>['body'];
export type DeleteCategoryParams = z.infer<typeof deleteCategorySchema>['params'];
