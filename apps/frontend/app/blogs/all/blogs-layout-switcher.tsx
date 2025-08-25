'use client';

import { LayoutGrid, List } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type BlogsLayoutOptions = 'grid' | 'list';

export function BlogsLayoutSwitcher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const layout = searchParams.get('layout') ?? 'grid';

  return (
    <div className="border p-1 flex items-center rounded-md h-9">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-7 w-7 hover:bg-secondary',
          layout === 'grid' && 'bg-secondary',
        )}
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.set('layout', 'grid');
          router.replace(`${pathname}?${params.toString()}`);
        }}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-7 w-7 hover:bg-secondary',
          layout === 'list' && 'bg-secondary',
        )}
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.set('layout', 'list');
          router.replace(`${pathname}?${params.toString()}`);
        }}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
