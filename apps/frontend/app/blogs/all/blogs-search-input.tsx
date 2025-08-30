'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

export function BlogsSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams.toString();
  const initialSearchQuery = searchParams.get('query')?.toString();

  const [localSearchQuery, setLocalSearchQuery] = useState(
    initialSearchQuery ?? '',
  );
  const debouncedLocalSearch = useDebounce(localSearchQuery);

  const setSearchParams = useCallback(
    (query?: string) => {
      const params = new URLSearchParams(searchParamsStr);

      if (query) {
        params.set('query', query);
      } else {
        params.delete('query');
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, searchParamsStr, pathname],
  );

  useEffect(() => {
    setSearchParams(debouncedLocalSearch);
  }, [debouncedLocalSearch, setSearchParams]);

  return (
    <div className="flex-1 relative w-full border rounded-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search Blogs..."
        className="h-9 pl-10 bg-background border-none w-full shadow-none"
        value={localSearchQuery}
        onChange={(e) => {
          setLocalSearchQuery(e.target.value);
        }}
      />
    </div>
  );
}
