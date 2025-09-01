import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PostData } from '@/app/(editor)/dal/get-post';
import { convertDateToReadableFormat } from '@/lib/date';
import Link from 'next/link';

export function ArchivePostCard({
  postData,
}: Readonly<{ postData: PostData }>) {
  return (
    <div className="hover:bg-secondary/40 px-4 py-4 ml-[-16px] rounded-md">
      <div className="grid grid-cols-[200px_1fr_max-content] items-center">
        <time className="text-foreground/60">
          {convertDateToReadableFormat(new Date(postData.updatedAt))}
        </time>
        <h2 className="text-xl font-medium">{postData.title}</h2>
        <Button
          variant="ghost"
          className="h-7 text-sm hover:bg-transparent hover:text-foreground"
        >
          <Link href={`/${postData.slug}`} className="flex items-center gap-2">
            Read more <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
