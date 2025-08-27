import { getPostData } from '@/app/(editor)/dal/get-post-data';
import { redirect } from 'next/navigation';
import { PostRenderer } from './post-renderer';
import { verifySession } from '@/app/(auth)/dal/verify-session';

export default async function PostEditorPage({
  params,
}: Readonly<{ params: Promise<{ postId: string }> }>) {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  const postId = (await params).postId;
  const postData = await getPostData(postId);

  return (
    <div className="min-h-screen">
      <PostRenderer postData={postData} />
    </div>
  );
}
