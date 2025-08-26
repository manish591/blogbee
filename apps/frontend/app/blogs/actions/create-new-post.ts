'use server';

import { redirect } from 'next/navigation';
import { API_URL } from '@/constants';
import { serializeCookies } from '@/lib/cookie';

export type NewPostFormSchema = {
  blogId: string;
};

export async function createNewPost(postData: Readonly<NewPostFormSchema>) {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieHeader,
    },
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    throw new Error('CREATE_NEW_POST_ERROR: Failed to create new post');
  }

  const data = await res.json();
  const postId = data.data.id;

  redirect(`/posts/${postId}/edit`);
}
