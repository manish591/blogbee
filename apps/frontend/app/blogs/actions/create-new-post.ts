"use server";

import { API_URL } from "@/constants";
import { serializeCookies } from "@/lib/cookie";
import { redirect } from "next/navigation";

export type NewPostFormSchema = {
  blodId: string
}

export async function createNewPost(postData: Readonly<NewPostFormSchema>) {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/posts`, {
    method: "POST",
    headers: {
      cookie: cookieHeader
    },
    body: JSON.stringify(postData)
  });

  if (!res) {
    throw new Error("CREATE_NEW_POST_ERROR: Failed to create new post");
  }

  const data = await res.json();
  const postId = data.data.id;

  redirect(`/posts/${postId}/edit`);
}