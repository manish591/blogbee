import { API_URL } from '@/constants';
import { serializeCookies } from '@/lib/cookie';
import 'server-only';

export type CategoriesData = {
  _id: string;
  name: string;
  description?: string;
  blogId: string;
  userId: string;
  posts: {
    id: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export async function getAllTags(blogId: string): Promise<CategoriesData[]> {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/categories?blogId=${blogId}`, {
    method: 'GET',
    headers: {
      cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    throw new Error('GET_ALL_TAGS_ERROR: Failed to fetch categories');
  }

  const data = await res.json();
  return data.data;
}
