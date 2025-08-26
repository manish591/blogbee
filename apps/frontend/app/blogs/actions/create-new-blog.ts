"use server";

import { API_URL } from "@/constants";
import { AddNewBlogSchema } from "../all/add-new-blog-form";
import { serializeCookies } from "@/lib/cookie";
import { revalidatePath } from "next/cache";

export async function createNewBlog(blogData: AddNewBlogSchema) {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader
    },
    body: JSON.stringify(blogData)
  });

  if (!res.ok) {
    throw new Error("CREATE_NEW_BLOG_ERROR: Failed to create new blog");
  }

  revalidatePath("/blogs/all");
}