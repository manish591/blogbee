import { Slash } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Logo } from '@/components/logo';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { BlogsSearchInput } from './blogs-search-input';
import { BlogsSortingDropdown } from './blogs-sorting-dropdown';
import { BlogsLayoutSwitcher } from './blogs-layout-switcher';
import { AddNewBlog } from './add-new-blog';
import { verifySession } from '@/app/dal/users/verify-session';
import { RenderBlogs } from './render-blogs';
import { Suspense } from 'react';
import { BlogsLoadingView } from './blogs-loading-view';

export default async function AllBlogsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const layout = (params.layout ?? 'grid') as string;
  const query = (params.query ?? '') as string;
  const sort = (params.sort ?? '') as string;
  const page = Number.isNaN(Number(params.page))
    ? 1
    : Math.max(1, Number(params.page));
  const limit = Number.isNaN(Number(params.limit))
    ? 10
    : Math.max(1, Number(params.limit));

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header>
        <div className="h-16 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
            <span>
              <Slash className="w-4 h-4 text-foreground/10 rotate-[-16deg]" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">My Blogs</span>
            </div>
          </div>
          <ProfileDropdown user={session.user} />
        </div>
      </Header>
      <main>
        <div className="space-y-8 py-6 pb-16">
          <div className="max-w-[1080px] mx-auto space-y-8">
            <section className="flex items-center gap-2">
              <div className="flex flex-1 items-center">
                <BlogsSearchInput />
              </div>
              <div className="flex items-center gap-2">
                <BlogsSortingDropdown />
                <BlogsLayoutSwitcher />
                <AddNewBlog />
              </div>
            </section>
            <Suspense fallback={<BlogsLoadingView />}>
              <RenderBlogs
                layout={layout}
                limit={limit}
                page={page}
                query={query}
                sort={sort}
              />
            </Suspense>
          </div>
        </div>
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
