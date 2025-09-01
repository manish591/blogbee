'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants';
import type { PostData } from '@/app/(editor)/dal/get-post';
import Link from 'next/link';

async function getPostsByQuery(
  blogSlug: string,
  query: string,
): Promise<{
  items: PostData[];
}> {
  const res = await fetch(
    `${API_URL}/v1/public/posts?blog=${blogSlug}&query=${query}`,
  );
  const data = await res.json();
  return data.data;
}

export function PostSearch({ blogSlug }: Readonly<{ blogSlug: string }>) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);
  const { data, isFetching, isEnabled } = useQuery({
    queryKey: ['postsByQuery', debouncedSearchQuery],
    queryFn: () => getPostsByQuery(blogSlug, debouncedSearchQuery),
    enabled: !!debouncedSearchQuery,
    staleTime: 0,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="top-[15%] translate-y-0 p-0 gap-0"
      >
        <DialogHeader className="p-4 py-3">
          <div className="flex items-center justify-between">
            <Search className="w-4 h-4 mb-[2px]" />
            <Input
              placeholder="Search posts"
              className="border-0 focus-visible:ring-[0px]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>
        </DialogHeader>
        {isFetching && (
          <div className="px-4 pb-4 transition-all">
            <p>loading</p>
          </div>
        )}
        {isEnabled && data && data.items.length <= 0 && (
          <div className="px-4 pb-4 transition-all">
            <p>No data found</p>
          </div>
        )}
        {data && data.items.length > 0 && (
          <div className="border-t max-h-[400px] overflow-auto">
            <div className="px-4 py-2">
              <p className="text-foreground/50 text-xs font-medium uppercase">
                Posts
              </p>
            </div>
            <div>
              {data?.items?.map((post) => {
                return (
                  <Link
                    href={`/${post.slug}`}
                    key={post._id}
                    className="block px-4 py-2 hover:bg-secondary/60"
                  >
                    <h4 className="font-medium capitalize">{post.title}</h4>
                    <p className="text-sm mt-1 text-foreground/50">
                      {post.subTitle}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
