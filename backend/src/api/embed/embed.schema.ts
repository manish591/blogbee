import { z } from "zod";

export const embedBlogSchema = z.object({
  params: z.object({
    blogSlug: z.string().trim(),
  })
});

export const embedPostSchema = z.object({
  params: z.object({
    blogSlug: z.string().trim(),
    postSlug: z.string().trim(),
  })
});

export const embedArchiveSchema = z.object({
  params: z.object({
    blogSlug: z.string().trim(),
  })
});