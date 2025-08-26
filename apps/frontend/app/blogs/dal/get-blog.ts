import { API_URL } from "@/constants";
import { serializeCookies } from "@/lib/cookie";
import "server-only";
import { BlogData } from "./get-all-blogs";

export async function getBlog(blogId: string): Promise<BlogData> {
  if (!API_URL) {
    throw new Error('ENV_NOT_DEFINED_ERROR: API URL is not defined');
  }

  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/blogs/${blogId}`, {
    method: "GET",
    headers: {
      cookie: cookieHeader
    }
  });

  if (!res.ok) {
    throw new Error("GET_BLOG_DATA_FAILED: Failed to get data by blogId");
  }

  const data = await res.json();
  return data.data;
}

