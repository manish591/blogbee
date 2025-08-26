"use server";

import { API_URL } from "@/constants";
import { serializeCookies } from "@/lib/cookie";
import { redirect } from "next/navigation";

export async function createNewPost() {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/posts`, {
    method: "POST",
    headers: {
      cookie: cookieHeader
    }
  });

  if (!res) {
    throw new Error("CREATE_NEW_POST_ERROR: Failed to create new post");
  }

  redirect(`/`)
}