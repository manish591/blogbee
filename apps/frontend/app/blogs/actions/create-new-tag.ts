'use server';

import { revalidatePath } from 'next/cache';
import { API_URL } from '@/constants';
import { serializeCookies } from '@/lib/cookie';
import type { AddNewTagSchema } from '../[blogId]/(dashboard)/tags/add-new-tag';

export async function createNewTag(tagData: AddNewTagSchema) {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieHeader,
    },
    body: JSON.stringify(tagData),
  });

  if (!res.ok) {
    throw new Error('CREATE_NEW_BLOG_ERROR: Failed to create new tag');
  }

  revalidatePath(`/blogs/${tagData.blogId}/tags`);
}
