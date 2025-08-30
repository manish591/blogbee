import { getAllPosts } from '@/app/blogs/dal/get-all-posts';
import { PostsGrid } from './posts-grid';

export async function RenderPosts({
  blogId,
  query,
  status,
  sort,
}: Readonly<{
  blogId: string;
  query?: string;
  status?: string;
  sort?: string;
}>) {
  const postData = await getAllPosts(blogId, {
    query,
    status,
    sort,
  });

  return (
    <div className="bg-card rounded-lg border">
      <PostsGrid postData={postData.items} />
    </div>
  );
}
