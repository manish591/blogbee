import { API_URL } from '@/constants';
import { serializeCookies } from '@/lib/cookie';
import 'server-only';

export type PostData = {
  _id: string;
  userId: string;
  blogId: string;
  postStatus: string;
  title: string;
  categories: {
    name: string,
    id: string;
  }[];
  slug?: string;
  subTitle?: string;
  content?: string;
  coverImg?: string;
  updatedAt: Date;
  createdAt: Date;
};

export async function getPost(postId: string): Promise<PostData> {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/posts/${postId}`, {
    method: 'GET',
    headers: {
      cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    throw new Error('GET_POST_DATA_ERROR: Failed to get post data');
  }

  const data = await res.json();
  return data.data;
}
