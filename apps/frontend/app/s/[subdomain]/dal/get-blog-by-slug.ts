import "server-only";
import type { PostData } from "@/app/(editor)/dal/get-post";
import type { BlogData } from "@/app/blogs/dal/get-all-blogs";
import type { CategoriesData } from "@/app/blogs/dal/get-all-categories";
import { API_URL } from "@/constants";

export async function getBlogBySlug(slug: string): Promise<{
  blog: BlogData,
  posts: PostData[]
  categories: CategoriesData[]
} | null> {
  const res = await fetch(`${API_URL}/v1/public/blogs?blog=${slug}`, {
    method: "GET"
  });

  if (!res.ok) {
    throw new Error("BLOG_DETAILS_FETCH_FAILED: Failed to fetch blog data");
  }

  const data = await res.json();
  return data.data;
}