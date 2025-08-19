import { Slash } from 'lucide-react';
import { BlogsManager } from '@/app/blogs/all/blogs-manager';
import { Footer } from '@/components/footer';
import {
  Header,
  Logo,
  Navbar,
  ProfileAvatar,
  ProfileDropdown,
} from '@/components/header';

export default function AllBlogsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header>
        <Navbar className="px-6">
          <div className="flex items-center space-x-2">
            <Logo />
            <span>
              <Slash className="w-4 h-4 text-foreground/10 rotate-[-16deg]" />
            </span>
            <div className="flex items-center gap-2">
              <ProfileAvatar />
              <span className="text-lg font-medium">My Blogs</span>
            </div>
          </div>
          <ProfileDropdown />
        </Navbar>
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
