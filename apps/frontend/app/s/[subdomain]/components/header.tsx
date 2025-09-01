import { Moon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PostSearch } from './post-search';
import type { BlogData } from '@/app/blogs/dal/get-all-blogs';

export function Header({ blogData }: Readonly<{ blogData: BlogData }>) {
  return (
    <header className="z-10 sticky top-0 w-full bg-background px-12">
      <div className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={24}
              height={24}
              alt="logo"
              className="bg-secondary hidden"
            />
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold capitalize">
                {blogData.slug}
              </span>
            </div>
          </div>
          <nav className="hidden items-center gap-6">
            <Link
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Home
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <PostSearch blogSlug={blogData.slug} />
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
            <Moon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
