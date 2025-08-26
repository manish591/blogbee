'use server';

import { revalidatePath } from 'next/cache';
import { API_URL } from '@/constants';
import { serializeCookies } from '@/lib/cookie';
import type { AddNewBlogSchema } from '../all/add-new-blog-form';

export async function createNewBlog(blogData: AddNewBlogSchema) {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieHeader,
    },
    body: JSON.stringify(blogData),
  });

  if (!res.ok) {
    throw new Error('CREATE_NEW_BLOG_ERROR: Failed to create new blog');
  }

  revalidatePath('/blogs/all');
}
