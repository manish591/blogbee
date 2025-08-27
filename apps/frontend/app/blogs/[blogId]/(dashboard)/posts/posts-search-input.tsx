'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';

export function PostsSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search articles"
        className="pl-10 bg-background border-border rounded-md"
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => {
          const query = e.target.value;
          const queryParams = new URLSearchParams(searchParams);

          if (query) {
            queryParams.set('query', query);
          } else {
            queryParams.delete('query');
          }

          router.replace(`${pathname}?${queryParams.toString()}`);
        }}
      />
    </div>
  );
}
