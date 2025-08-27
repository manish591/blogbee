"use server";

import { API_URL } from "@/constants";
import { serializeCookies } from "@/lib/cookie";

export async function restorePost(postId: string) {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader
    },
    body: JSON.stringify({
      postStatus: 1
    })
  });

  if (!res.ok) {
    throw new Error("RESTORE_POST_ERROR: Failed to restore post");
  }
}