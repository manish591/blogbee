import { z } from "zod";

export const getPublicBlogDetailsSchema = z.object({
  query: z.object({
    blog: z.string().trim()
  }).strict()
});

export const getPublicPostsListSchema = z.object({
  query: z.object({
    blog: z.string().trim(),
    limit: z.coerce.number().optional().default(10),
    page: z.coerce.number().optional().default(1),
    q: z.string().optional().default("")
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