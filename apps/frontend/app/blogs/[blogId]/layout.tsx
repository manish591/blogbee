import { Slash } from 'lucide-react';
import { BlogDashboardSidebar } from '@/app/blogs/[blogId]/sidebar';
import { Header } from '@/components/header';
import { Logo } from '@/components/logo';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { BlogsSwitcher } from './blog-switcher';
import { verifySession } from '@/app/(auth)/dal/verify-session';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
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
        <div className="grid grid-cols-[280px_minmax(0,1fr)]">
          <BlogDashboardSidebar blogId={blogId} />
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
}
