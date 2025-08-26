'use client';

import { useState } from 'react';
import { createNewPost } from '@/app/blogs/actions/create-new-post';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type AddNewPostButtonProps = React.ComponentProps<'button'> & {
  blogId: string;
};

export function AddNewPostButton({
  children,
  className,
  blogId,
}: AddNewPostButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateNewPost() {
    setIsLoading(true);
    try {
      await createNewPost({ blogId });
      setIsLoading(false);
      console.log('CREATE_NEW_POST_SUCCESS: Create new draft successfully');
    } catch (err) {
      setIsLoading(false);
      console.log('CREATE_NEW_POST_ERROR: Failed to create new post', err);
    }
  }

  return (
    <Button
      className={cn('cursor-pointer', className)}
      onClick={handleCreateNewPost}
    >
      {isLoading && (
        <output
          className="animate-spin inline-block size-3.5 border-2 border-current border-t-transparent text-white rounded-full"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </output>
      )}
      {children}
    </Button>
  );
}
