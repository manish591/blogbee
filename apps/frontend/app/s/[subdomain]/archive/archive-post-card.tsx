import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { PostData } from '@/app/(editor)/dal/get-post';
import { Button } from '@/components/ui/button';
import { convertDateToReadableFormat } from '@/lib/date';

export function ArchivePostCard({
  postData,
}: Readonly<{ postData: PostData }>) {
  return (
    <Link href={`/${postData.slug}`} className="block">
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
            <p className="flex items-center gap-2">
              Read more <ArrowRight />
            </p>
          </Button>
        </div>
      </div>
    </Link>
  );
}
