import { Slash } from 'lucide-react';
import { redirect } from 'next/navigation';
import { BlogsManager } from '@/app/blogs/all/blogs-manager';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Logo } from '@/components/logo';
import { ProfileAvatar } from '@/components/profile-avatar';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { verifySession } from '@/lib/dal';

export default async function AllBlogsPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

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
              <ProfileAvatar
                profileImg={session.user?.profileImg}
                profileName={session.user.name}
              />
              <span className="text-lg font-medium">My Blogs</span>
            </div>
          </div>
          <ProfileDropdown user={session.user} />
        </div>
      </Header>
      <main>
        <BlogsManager />
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
