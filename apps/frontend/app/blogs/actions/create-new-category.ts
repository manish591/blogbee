'use server';

import { revalidatePath } from 'next/cache';
import { API_URL } from '@/constants';
import { serializeCookies } from '@/lib/cookie';
import type { AddNewTagSchema } from '../[blogId]/(dashboard)/categories/add-new-category';

export async function createNewTag(categoryData: AddNewTagSchema) {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieHeader,
    },
    body: JSON.stringify(categoryData),
  });

  if (!res.ok) {
    throw new Error('CREATE_NEW_BLOG_ERROR: Failed to create new category');
  }

  revalidatePath(`/blogs/${categoryData.blogId}/categories`);
}
