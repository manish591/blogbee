'use client';

import { AddNewBlog } from '@/app/blogs/all/add-new-blog';
import { BlogsFilters } from '@/app/blogs/all/blogs-filters';
import { BlogsGrid } from '@/app/blogs/all/blogs-grid';
import { BlogLayoutOptions } from '@/app/blogs/all/blogs-layout-options';
import { BlogsSearchInput } from '@/app/blogs/all/blogs-search-input';

const BLOGS_DATA = [
  {
    id: 1,
    name: 'Personal blog',
    url: 'personal.app',
    posts: 15,
    lastUpdated: '29 Nov 2023',
    logo: '',
  },
  {
    id: 2,
    name: 'Other blog',
    url: 'other.so/blog',
    posts: 18,
    lastUpdated: '17 Nov 2023',
    logo: '',
  },
  {
    id: 3,
    name: 'My Journal',
    url: 'my-journal.blog',
    posts: 12,
    lastUpdated: '17 Oct 2022',
    logo: '',
  },
  {
    id: 4,
    name: 'Travel Niche Blog',
    url: 'travel-niche.com',
    posts: 26,
    lastUpdated: '23 Oct 2022',
    logo: '',
  },
  {
    id: 5,
    name: 'Notion Blog',
    url: 'notion.blog',
    posts: 17,
    lastUpdated: '1 Sep 2022',
    logo: '',
  },
  {
    id: 6,
    name: 'Finance Blog',
    url: 'finance.blog',
    posts: 7,
    lastUpdated: '4 Aug 2022',
    logo: '',
  },
  {
    id: 7,
    name: 'Community Blog',
    url: 'community.so',
    posts: 4,
    lastUpdated: '16 Jul 2022',
    logo: '',
  },
  {
    id: 8,
    name: 'Notion Store',
    url: 'notion.store',
    posts: 8,
    lastUpdated: '10 Apr 2022',
    logo: '',
  },
];

export function BlogsManager() {
  return (
    <div className="space-y-8 py-6 pb-16">
      <div className="max-w-[1080px] mx-auto space-y-8">
        <section className="flex items-center gap-4">
          <div className="flex flex-1 items-center">
            <BlogsSearchInput />
          </div>
          <div className="flex items-center gap-2">
            <BlogsFilters />
            <BlogLayoutOptions />
            <AddNewBlog />
          </div>
        </section>
        <BlogsGrid blogsData={BLOGS_DATA} showListLayout />
      </div>
    </div>
  );
}
