'use server';

import { API_URL } from '@/constants';
import { serializeCookies } from '@/lib/cookie';
import type { EditBlogData } from '../[blogId]/(dashboard)/settings/blog-settings-form';

export async function editBlog(blogData: EditBlogData) {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/blogs/${blogData.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieHeader,
    },
    body: JSON.stringify({
      name: blogData.name,
      about: blogData.about,
    }),
  });

  if (!res.ok) {
    throw new Error('EDIT_BLOG_ERROR: Failed to edit blog');
  }
}
