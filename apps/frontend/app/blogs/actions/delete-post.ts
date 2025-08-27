"use server";

import { API_URL } from "@/constants";
import { serializeCookies } from "@/lib/cookie";

export async function deletePost(postId: string) {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/posts/${postId}`, {
    method: "DELETE",
    headers: {
      cookie: cookieHeader
    }
  });

  if (!res.ok) {
    throw new Error("DELETE_POST_FAILED: Failed to delete the post");
  }
}