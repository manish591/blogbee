import { getAllPosts } from '@/app/blogs/dal/get-all-posts';
import { PostsGrid } from './posts-grid';

export async function RenderPosts({
  blogId,
  query,
}: Readonly<{ blogId: string; query: string }>) {
  const postData = await getAllPosts(blogId, {
    query,
  });

  return (
    <div className="bg-card rounded-lg border">
      <PostsGrid postData={postData.items} />
    </div>
  );
}
