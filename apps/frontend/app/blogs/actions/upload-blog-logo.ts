"use server";

import { API_URL } from "@/constants";
import { serializeCookies } from "@/lib/cookie";

export async function uploadBlogLogo(formData: FormData): Promise<string> {
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