import { ChevronsUpDown, Slash } from 'lucide-react';
import { BlogDashboardSidebar } from '@/app/blogs/[blogId]/dashboard/blog-dashboard-sidebar';
import { Header } from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';
import { ProfileDropdown } from '@/components/profile-dropdown';

export default async function BlogDashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ blogId: string }>;
}>) {
  const blogId = (await params).blogId;

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header>
        <div className="px-6">
          <div className="flex items-center space-x-2">
            <Logo />
            <span>
              <Slash className="w-4 h-4 text-foreground/10 rotate-[-16deg]" />
            </span>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://adhhd.png" />
                <AvatarFallback className="bg-accent border text-sm">
                  P
                </AvatarFallback>
              </Avatar>
              <span className="text-base font-medium">Personal Blog</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="hover:bg-secondary h-7 w-7 rounded-[50px] flex items-center justify-center p-1 mt-[2px]">
                    <ChevronsUpDown className="w-4 h-4 text-foreground/70" />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 shadow-sm" align="center">
                  <DropdownMenuLabel className="text-foreground/70 text-sm">
                    Blogs
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-secondary border text-xs">
                            <span className="mt-[1px]">P</span>
                          </AvatarFallback>
                        </Avatar>
                        <span>Personal Blog</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-secondary border text-xs">
                            <span className="mt-[1px]">S</span>
                          </AvatarFallback>
                        </Avatar>
                        <span>Systemekit</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <ProfileDropdown
            user={{
              email: 'manishdevrani777@gmail.com',
              name: 'manish',
            }}
          />
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
