import { z } from 'zod';

export const createTagSchema = z.object({
  body: z
    .object({
      blogId: z.string(),
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

export const editTagSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
    })
    .strict(),
  params: z
    .object({
      tagId: z.string(),
    })
    .strict(),
});

export const deleteTagSchema = z.object({
  params: z
    .object({
      blogId: z.string(),
      tagId: z.string(),
    })
    .strict(),
});

export type TCreateTagParams = z.infer<typeof createTagSchema>['params'];
export type TCreateTagBody = z.infer<typeof createTagSchema>['body'];
export type TGetAllTagsParams = z.infer<typeof getAllTagsSchema>['params'];
export type TEditTagParams = z.infer<typeof editTagSchema>['params'];
export type TEditTagBody = z.infer<typeof editTagSchema>['body'];
export type TDeleteTagParams = z.infer<typeof deleteTagSchema>['params'];
