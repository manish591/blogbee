import type { PostData } from '@/app/blogs/dal/get-all-posts';
import { Button } from '@/components/ui/button';
import { convertDateToReadableFormat } from '@/lib/date';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { PostsOptionsDropdown } from './post-options-dropdown';

export function PostsGrid({ postData }: Readonly<{ postData: PostData[] }>) {
  return (
    <>
      {postData.map((post, index) => (
        <div
          key={post._id}
          className={`grid grid-cols-12 gap-4 p-4 ${index !== postData.length - 1 ? 'border-b' : ''}`}
        >
          <div className="col-span-6">
            <h3 className="font-medium text-foreground mb-2 hover:text-primary cursor-pointer">
              {post.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-foreground/60 text-sm">Updated On</span>
              <span className="text-foreground/60 text-sm">•</span>
              <span className="text-foreground/60 text-sm">
                {convertDateToReadableFormat(new Date(post.updatedAt))}
              </span>
            </div>
          </div>
          <div className="col-span-4 flex items-center">
            <span className="text-muted-foreground text-sm">{post.slug}</span>
          </div>
          <div className="col-span-2 flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 cursor-pointer"
              asChild
            >
              <Link href={`/posts/${post._id}/edit`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
            <PostsOptionsDropdown />
          </div>
        </div>
      ))}
    </>
  );
}
