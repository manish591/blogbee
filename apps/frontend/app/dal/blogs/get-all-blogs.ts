import "server-only";
import { API_URL } from "@/constants";
import { serializeCookies } from "@/lib/cookie";

export type GetAllBlogsOptions = {
  sort?: string,
  query?: string;
  page?: number;
  limit?: number;
}

export type BlogData = {
  _id: string,
  name: string,
  slug: string,
  about: string,
  createdAt: string,
  updatedAt: string
}

export async function getAllBlogs({ query, page, limit, sort }: Readonly<GetAllBlogsOptions>): Promise<BlogData[]> {
  if (!API_URL) {
    throw new Error('ENV_NOT_DEFINED_ERROR: API URL is not defined');
  }

  const cookieHeader = await serializeCookies();

  const url = new URL(`${API_URL}/v1/blogs`);
  if (query) url.searchParams.append("query", query);
  if (page) url.searchParams.append("page", String(page));
  if (limit) url.searchParams.append("limit", String(limit));
  if (sort) url.searchParams.append("sort", sort);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      cookie: cookieHeader
    }
  });

  if (!res.ok) {
    throw new Error("BLOGS_FETCH_ERROR: Failed to fetch blogs");
  }

  const data = await res.json();

  return data.data;
}