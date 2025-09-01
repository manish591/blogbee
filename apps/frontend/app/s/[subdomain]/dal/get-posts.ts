import type { PostData } from '@/app/(editor)/dal/get-post';
import { API_URL } from '@/constants';
import 'server-only';

export async function getPosts(
  blogSlug: string,
  options?: {
    category?: string;
    query?: string;
  },
): Promise<{
  currentPage: number;
  totalItems: number;
  totalPages: number;
  items: PostData[];
}> {
  const url = new URL(`${API_URL}/v1/public/posts?blog=${blogSlug}`);
  if (options?.category) url.searchParams.append('category', options.category);
  if (options?.query) url.searchParams.append('query', options.query);

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('FETCH_POSTS_ERROR: Failed to fetch posts');
  }

  const data = await res.json();
  console.log("the data: ", data);
  return data.data;
}
