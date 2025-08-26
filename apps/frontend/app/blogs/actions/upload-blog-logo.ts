"use server";

import { API_URL } from "@/constants";
import { serializeCookies } from "@/lib/cookie";

export async function uploadBlogLogo(formData: FormData): Promise<string> {
  if (!API_URL) {
    throw new Error('ENV_NOT_DEFINED_ERROR: API URL is not defined');
  }

  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/blogs/logo`, {
    method: "POST",
    headers: {
      cookie: cookieHeader,
    },
    body: formData
  });

  if (!res.ok) {
    throw new Error("UPLOAD_LOGO_FAILED: Failed to upload blog logo");
  }

  const data = await res.json();
  return data.data.url;
}