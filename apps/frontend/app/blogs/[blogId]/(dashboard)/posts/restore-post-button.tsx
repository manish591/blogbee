'use client';

import { RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { restorePost } from '@/app/blogs/actions/restore-post';
import { Button } from '@/components/ui/button';

export function RestorePostButton({ postId }: Readonly<{ postId: string }>) {
  const router = useRouter();

  async function handleRestorePost() {
    try {
      await restorePost(postId);
      router.refresh();
      console.log('RESTORE_POST_SUCCESS: Successfully restored post');
    } catch (err) {
      console.log('RESTORE_POST_ERROR: Failed to restore post', err);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      onClick={handleRestorePost}
    >
      <RotateCcw />
    </Button>
  );
}
