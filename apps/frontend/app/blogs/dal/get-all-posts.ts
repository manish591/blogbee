import { API_URL } from '@/constants';
import { serializeCookies } from '@/lib/cookie';
import 'server-only';

export type PostData = {
  _id: string;
  userId: string;
  blogId: string;
  title: string;
  postStatus: number;
  tags: string[];
  subTitle?: string;
  slug?: string;
  content?: string;
  coverImg?: string;
  createdAt: string;
  updatedAt: string;
};

export type GetAllPostsReturnValue = {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  items: PostData[];
};

export type GetAllPostsOptions = {
  query?: string;
};

export async function getAllPosts(
  blogId: string,
  opts?: GetAllPostsOptions,
): Promise<GetAllPostsReturnValue> {
  const cookieHeader = await serializeCookies();

  const url = new URL(`${API_URL}/v1/posts`);
  url.searchParams.append('blogId', blogId);
  if (opts?.query) url.searchParams.append('query', opts.query);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    throw new Error('GET_ALL_POSTS_FAILED: Failed to get all the posts');
  }

  const data = await res.json();
  return data.data;
}
