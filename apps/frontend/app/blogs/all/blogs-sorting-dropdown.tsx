'use client';

import { Check, ListFilter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function BlogsSortingDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sort');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9">
          <ListFilter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set('sort', 'latest');
            router.replace(`${pathname}?${params.toString()}`);
          }}
        >
          <div className="flex w-full justify-between">
            Latest{' '}
            {sortBy === 'latest' && (
              <Check className="w-4 h-4 text-green-600 mt-[2px]" />
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set('sort', 'oldest');
            router.replace(`${pathname}?${params.toString()}`);
          }}
        >
          <div className="flex w-full justify-between">
            Oldest
            {sortBy === 'oldest' && (
              <Check className="w-4 h-4 text-green-600 mt-[2px]" />
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
