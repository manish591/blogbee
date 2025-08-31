import Image from 'next/image';
import type { PostData } from '@/app/(editor)/dal/get-post';
import { cn } from '@/lib/utils';
import { convertDateToReadableFormat } from '@/lib/date';

export function PostCard({
  isFeatured,
  postData,
}: Readonly<{ isFeatured?: boolean; postData: PostData }>) {
  return (
    <article
      className={cn(
        'grid grid-cols-[200px_minmax(0,1fr)] gap-6',
        isFeatured && 'grid-cols-1',
      )}
    >
      {!isFeatured && (
        <div className="mb-4">
          <Image
            src="/placeholder.png"
            width={800}
            height={600}
            alt="blog"
            className="aspect-square w-full object-cover rounded-lg"
          />
        </div>
      )}
      <div>
        <div className="mb-1">
          <time
            className={cn(
              'text-foreground/40 font-medium uppercase tracking-wide text-sm',
              isFeatured && 'text-base',
            )}
          >
            {convertDateToReadableFormat(new Date(postData.updatedAt))}
          </time>
        </div>
        <h2
          className={cn(
            'text-2xl font-medium mb-4 flex items-center gap-2 capitalize',
            isFeatured && 'text-4xl',
          )}
        >
          {postData.title}
        </h2>
        {isFeatured && (
          <div className="mb-4">
            <Image
              src="/placeholder.png"
              width={800}
              height={600}
              alt="blog"
              className="w-full object-cover rounded-lg"
            />
          </div>
        )}
        <div>
          <p
            className={cn(
              'text-xl text-foreground/60',
              isFeatured && 'text-foreground/80',
            )}
          >
            {postData.content}
          </p>
        </div>
      </div>
    </article>
  );
}
