import { z } from "zod";

export const getPublicBlogDetailsSchema = z.object({
  query: z.object({
    blog: z.string().trim()
  }).strict()
});

export const getPublicPostsListSchema = z.object({
  query: z.object({
    blog: z.string().trim(),
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    q: z.string().optional()
  }).strict()
});

export const getPublicPostDetailsSchema = z.object({
  params: z.object({
    postSlug: z.string().trim()
  }).strict(),
  query: z.object({
    blog: z.string().trim()
  }).strict()
});