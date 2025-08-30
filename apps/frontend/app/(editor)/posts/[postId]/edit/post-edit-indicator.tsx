import { CloudCheck } from 'lucide-react';

export function PostEditIndicator({
  isSavingPost,
}: Readonly<{ isSavingPost: boolean | null }>) {
  if (isSavingPost === null) {
    return null;
  }

  return (
    <>
      {!isSavingPost ? (
        <div className="flex items-center gap-2 text-green-500 mr-4">
          <CloudCheck /> <span>Saved</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-foreground/60 mr-4">
          <output
            className="animate-spin inline-block size-4 border-2 border-current border-t-transparent text-foreground/60 rounded-full dark:text-blue-500"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </output>
          <span>Saving..</span>
        </div>
      )}
    </>
  );
}
