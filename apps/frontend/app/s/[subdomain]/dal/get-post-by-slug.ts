import type { PostData } from '@/app/(editor)/dal/get-post';
import { API_URL } from '@/constants';

export async function getPostBySlug(
  postSlug: string,
  blogSlug: string,
): Promise<PostData> {
  const res = await fetch(
    `${API_URL}/v1/public/posts/${postSlug}?blog=${blogSlug}`,
  );
  const data = await res.json();
  return data.data;
}
