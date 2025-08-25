'use client';

import { Search } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';

export function BlogsSearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex-1 relative w-full border rounded-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search Blogs..."
        className="h-9 pl-10 bg-background border-none w-full shadow-none"
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams);
          const query = e.target.value;

          if (query) {
            params.set('query', query);
          } else {
            params.delete('query');
          }

          router.replace(`${pathname}?${params.toString()}`);
        }}
      />
    </div>
  );
}
