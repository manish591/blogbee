'use client';

import { useState } from 'react';
import { Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export type PostSortFilterValues = 'latest' | 'oldest';
export type PostStatusFilterValues = 'draft' | 'published' | 'archived';

export function PostsFilters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="outline" className="rounded-md px-6 bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-0 pb-1">
        <PostsFiltersTabs openDropdown={setIsOpen} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PostsFiltersTabs({
  openDropdown,
}: Readonly<{ openDropdown: React.Dispatch<React.SetStateAction<boolean>> }>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sort = searchParams.get('sort')?.toString() as
    | PostSortFilterValues
    | undefined;
  const status = searchParams.get('status')?.toString() as
    | PostStatusFilterValues
    | undefined;

  const [localSortValue, setLocalSortValue] = useState<
    PostSortFilterValues | undefined
  >(sort);
  const [localStatusValue, setLocalStatusValue] = useState<
    PostStatusFilterValues | undefined
  >(status);

  function handleApplyFilters() {
    const queryParams = new URLSearchParams(searchParams);

    if (localSortValue) {
      queryParams.set('sort', localSortValue);
    } else {
      queryParams.delete('sort');
    }

    if (localStatusValue) {
      queryParams.set('status', localStatusValue);
    } else {
      queryParams.delete('status');
    }

    router.replace(`${pathname}?${queryParams.toString()}`);
    openDropdown(false);
  }

  return (
    <>
      <Tabs defaultValue="sort" className="w-full">
        <TabsList className="w-full bg-transparent border-b rounded-none">
          <TabsTrigger
            value="sort"
            className="data-[state=active]:bg-secondary data-[state=active]:shadow-none"
          >
            Sort
          </TabsTrigger>
          <TabsTrigger
            value="status"
            className="data-[state=active]:bg-secondary data-[state=active]:shadow-none"
          >
            Status
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sort" className="px-1 text-foreground/70">
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex justify-start px-2"
            onClick={() => {
              setLocalSortValue('latest');
            }}
          >
            Latest{' '}
            {localSortValue === 'latest' && (
              <span className="ml-auto">
                <Check className="w-4 h-4 text-green-600 mt-[2px]" />
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex justify-start px-2"
            onClick={() => {
              setLocalSortValue('oldest');
            }}
          >
            Oldest{' '}
            {localSortValue === 'oldest' && (
              <span className="ml-auto">
                <Check className="w-4 h-4 text-green-600 mt-[2px]" />
              </span>
            )}
          </Button>
        </TabsContent>
        <TabsContent value="status" className="px-1 text-foreground/70">
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex justify-start px-2"
            onClick={() => {
              setLocalStatusValue('draft');
            }}
          >
            Draft{' '}
            {localStatusValue === 'draft' && (
              <span className="ml-auto">
                <Check className="w-4 h-4 text-green-600 mt-[2px]" />
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex justify-start px-2"
            onClick={() => {
              setLocalStatusValue('archived');
            }}
          >
            Deleted{' '}
            {localStatusValue === 'archived' && (
              <span className="ml-auto">
                <Check className="w-4 h-4 text-green-600 mt-[2px]" />
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex justify-start px-2"
            onClick={() => {
              setLocalStatusValue('published');
            }}
          >
            Published{' '}
            {localStatusValue === 'published' && (
              <span className="ml-auto">
                <Check className="w-4 h-4 text-green-600 mt-[2px]" />
              </span>
            )}
          </Button>
        </TabsContent>
      </Tabs>
      <DropdownMenuSeparator />
      <div className="w-full px-1 flex">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-[0.8rem]"
          onClick={() => {
            openDropdown(false);
          }}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="ml-auto h-7 text-[0.8rem]"
          onClick={handleApplyFilters}
        >
          Apply Changes
        </Button>
      </div>
    </>
  );
}
