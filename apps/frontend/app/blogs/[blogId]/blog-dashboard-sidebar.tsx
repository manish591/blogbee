import {
  ExternalLink,
  LayoutDashboard,
  NotepadText,
  Settings,
  Tags,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/constants';
import { getBlog } from '../dal/get-blog';

export async function BlogDashboardSidebar({
  selectedBlogId,
}: Readonly<{ selectedBlogId: string }>) {
  const blogData = await getBlog(selectedBlogId);

  return (
    <>
      <div className="pl-4 px-4 mt-4 space-y-1">
        <Link
          href={`/blogs/${selectedBlogId}`}
          className="text-[15px] text-foreground/70 flex items-center gap-2 hover:bg-secondary transition-colors py-[5px] px-2 rounded-md"
        >
          <LayoutDashboard className="w-4 h-4" strokeWidth={2} />
          <span>Overview</span>
        </Link>
        <Link
          href={`/blogs/${selectedBlogId}/settings`}
          className="text-[15px] text-foreground/70 flex items-center gap-2 hover:bg-secondary transition-colors py-[5px] px-2 rounded-md"
        >
          <Settings className="w-4 h-4" strokeWidth={2} />
          <span>Settings</span>
        </Link>
      </div>
      <div className="h-[1px] w-[90%] mx-auto mt-3 bg-border/60" />
      <div className="pl-4 px-4 mt-4 space-y-1">
        <Link
          href={`/blogs/${selectedBlogId}/posts`}
          className="text-[15px] text-foreground/70 flex items-center gap-2 hover:bg-secondary transition-colors py-[5px] px-2 rounded-md"
        >
          <NotepadText className="w-4 h-4" strokeWidth={2} />
          <span>Posts & drafts</span>
        </Link>
        <Link
          href={`/blogs/${selectedBlogId}/tags`}
          className="text-[15px] text-foreground/70 flex items-center gap-2 hover:bg-secondary transition-colors py-[5px] px-2 rounded-md"
        >
          <Tags className="w-4 h-4" strokeWidth={2} />
          <span>Tags</span>
        </Link>
      </div>
      <div className="mt-auto px-6">
        <Button
          variant="outline"
          className="w-full h-10 text-foreground/70 gap-3 cursor-pointer"
          asChild
        >
          <Link href={`https://${blogData.slug}.${APP_NAME}.site`}>
            <ExternalLink className="w-4 h-4" />
            <span>Visit Blog</span>
          </Link>
        </Button>
      </div>
    </>
  );
}
