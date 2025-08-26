import { Slash } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { verifySession } from '@/app/(auth)/dal/verify-session';
import { BlogDashboardSidebar } from '@/app/blogs/[blogId]/blog-dashboard-sidebar';
import { Header } from '@/components/header';
import { Logo } from '@/components/logo';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { BlogDashboardSidebarLoader } from './blog-dashboard-sidebar-loader';
import { BlogsSwitcher } from './blog-switcher';
import { BlogSwitcherLoader } from './blog-switcher-loader';

export default async function BlogDashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ blogId: string }>;
}>) {
  const blogId = (await params).blogId;
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header>
        <div className="h-16 flex justify-between px-6">
          <div className="flex items-center space-x-2">
            <Logo />
            <span>
              <Slash className="w-4 h-4 text-foreground/10 rotate-[-16deg]" />
            </span>
            <Suspense fallback={<BlogSwitcherLoader />}>
              <BlogsSwitcher selectedBlogId={blogId} />
            </Suspense>
          </div>
          <ProfileDropdown user={session.user} />
        </div>
      </Header>
      <main>
        <div className="grid grid-cols-[260px_minmax(0,1fr)]">
          <aside className="sticky top-[70px] h-[calc(100svh-70px)] bg-background border-r overflow-auto py-4 flex flex-col">
            <div className="px-6">
              <p className="uppercase text-sm">Blog Dashboard</p>
            </div>
            <Suspense fallback={<BlogDashboardSidebarLoader />}>
              <BlogDashboardSidebar selectedBlogId={blogId} />
            </Suspense>
          </aside>
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
}
