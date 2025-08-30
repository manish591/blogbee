'use client';

import { useEffect, useState } from 'react';
import { editPost } from '@/app/(editor)/actions/edit-post';
import { useDebounce } from '@/hooks/use-debounce';

export function PostEditor({
  setIsSavingPost,
  title,
  content,
  postId,
}: Readonly<{
  setIsSavingPost: React.Dispatch<React.SetStateAction<boolean | null>>;
  title: string;
  content: string;
  postId: string;
}>) {
  const [postTitle, setPostTitle] = useState(title);
  const [postContent, setPostContent] = useState(content);
  const debouncedTitle = useDebounce(postTitle);
  const debouncedContent = useDebounce(postContent);

  useEffect(() => {
    (async () => {
      setIsSavingPost(true);
      try {
        await editPost(postId, {
          title: debouncedTitle,
          content: debouncedContent,
        });
        setIsSavingPost(false);
      } catch (err) {
        setIsSavingPost(false);
        console.log('EDITING_POST_ERROR: Failed to edit the post', err);
      }
    })();
  }, [debouncedTitle, debouncedContent, postId, setIsSavingPost]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <textarea
        placeholder="Article Title..."
        rows={1}
        maxLength={150}
        value={postTitle}
        className="resize-none font-semibold text-4xl w-full overflow-hidden mb-8 outline-none border-none focus:outline-none"
        onChange={(e) => {
          const title = e.target.value;
          setPostTitle(title);
        }}
      ></textarea>
      <textarea
        placeholder="Edit post content"
        value={postContent}
        className="w-full text-lg outline-none border-none focus:outline-none"
        onChange={(e) => {
          setPostContent(e.target.value);
        }}
      ></textarea>
    </div>
  );
}
