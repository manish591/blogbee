import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PostCard } from '@/app/s/[subdomain]/_components/post-card';
import { Button } from '@/components/ui/button';

export default function PostCategoriesPage() {
  return (
    <div className="py-24 max-w-7xl mx-auto px-8">
      <div className="flex-1">
        <div className="mb-12">
          <h1 className="text-4xl font-bold leading-tight">Interviews</h1>
        </div>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-12">
        <div>
          <PostCard />
          <span className="h-[1px] w-full border block my-8"></span>
          <PostCard />
          <span className="h-[1px] w-full border block my-8"></span>
          <PostCard />

          <div className="flex items-center justify-center mt-10">
            <Button variant="outline" className="h-7 text-[0.8rem">
              Load more
              <ArrowRight />
            </Button>
          </div>
        </div>
        <aside className="w-64 space-y-8 py-2">
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-foreground/70 hover:text-foreground"
                >
                  All
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-foreground/70 hover:text-foreground"
                >
                  Interviews
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-foreground/70 hover:text-foreground"
                >
                  Interviews
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-foreground/70 hover:text-foreground"
                >
                  Podcast
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-foreground/70 hover:text-foreground"
                >
                  Inspiration
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
