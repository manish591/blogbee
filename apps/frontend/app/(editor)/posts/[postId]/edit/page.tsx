import { notFound, redirect } from 'next/navigation';
import { verifySession } from '@/app/(auth)/dal/verify-session';
import { getPost } from '@/app/(editor)/dal/get-post';
import { PostRenderer } from './post-renderer';
import { getBlog } from '@/app/blogs/dal/get-blog';

export default async function PostEditorPage({
  params,
}: Readonly<{ params: Promise<{ postId: string }> }>) {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  const postId = (await params).postId;
  const postData = await getPost(postId);
  const blogData = await getBlog(postData.blogId);

  if (postData.postStatus === 'archived') {
    redirect(notFound());
  }

  return (
    <div className="min-h-screen">
      <PostRenderer postData={postData} blogData={blogData} />
    </div>
  );
}
