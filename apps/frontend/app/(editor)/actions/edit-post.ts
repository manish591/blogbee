'use server';

import { API_URL } from '@/constants';
import { serializeCookies } from '@/lib/cookie';

export type EditPostData = {
  title?: string;
  subTitle?: string;
  content?: string;
  slug?: string;
  postStatus?: string;
  coverImg?: string;
  categories?: string;
};

export async function editPost(postId: string, data: EditPostData) {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieHeader,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('EDIT_POST_ERROR: Failed to edit the posts');
  }
}
