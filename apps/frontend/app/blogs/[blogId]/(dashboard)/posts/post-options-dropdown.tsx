'use client';

import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/app/blogs/actions/delete-post';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function PostsOptionsDropdown({ postId }: Readonly<{ postId: string }>) {
  const router = useRouter();

  async function handleDeletePost() {
    try {
      await deletePost(postId);
      console.log('DELETE_POST_SUCCESS: Deleted the post successfully');
      router.refresh();
    } catch (err) {
      console.log('DELETE_POST_ERROR: Failed to delete the psot', err);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={handleDeletePost}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
