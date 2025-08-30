'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

export function PostsSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const initialSearchQuery = searchParams.get('query')?.toString();

  const [localQuerySearch, setLocalQuerySearch] = useState(
    initialSearchQuery ?? '',
  );
  const debouncedLocalQuerySearch = useDebounce(localQuerySearch);

  const setSearchParams = useCallback(
    (query?: string) => {
      const queryParams = new URLSearchParams(searchParamsStr);

      if (query) {
        queryParams.set('query', query);
      } else {
        queryParams.delete('query');
      }

      router.replace(`${pathname}?${queryParams.toString()}`);
    },
    [router, searchParamsStr, pathname],
  );

  useEffect(() => {
    setSearchParams(debouncedLocalQuerySearch);
  }, [debouncedLocalQuerySearch, setSearchParams]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search articles"
        className="pl-10 bg-background border-border rounded-md"
        value={localQuerySearch}
        onChange={(e) => {
          setLocalQuerySearch(e.target.value);
        }}
      />
    </div>
  );
}
