import {
  BarChart3,
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
  LayoutDashboard,
  LayoutGrid,
  List,
  ListFilter,
  NotepadText,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Settings2,
  Slash,
  Tags,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function BlogDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <header className="border-b sticky top-0 z-10 bg-background">
        <nav className="h-16 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">Writely</span>
            <span>
              <Slash className="w-4 h-4 text-foreground/10 rotate-[-16deg]" />
            </span>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="" />
                <AvatarFallback className="bg-accent border text-sm">
                  P
                </AvatarFallback>
              </Avatar>
              <span className="text-base">Personal Blog</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="hover:bg-secondary h-7 w-7 rounded-[50px] flex items-center justify-center p-1 mt-[2px]">
                    <ChevronsUpDown className="w-4 h-4 text-foreground/70" />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="center">
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusCircle className="w-4 h-4 text-primary" />
                    Create a new Blog
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-6">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      <main>
        <div className="grid grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-[calc(100svh-70px)] bg-background border-r overflow-auto py-4 flex flex-col">
            <div className="px-6">
              <p className="uppercase text-sm">Blog Dashboard</p>
            </div>
            <div className="pl-4 px-6 mt-4 space-y-1">
              <div className="text-foreground/70 flex items-center gap-2 hover:bg-secondary transition-colors p-1 px-2 rounded-md">
                <LayoutDashboard className="w-4 h-4" strokeWidth={2} />
                <span>Overview</span>
              </div>
              <div className="text-foreground/70 flex items-center gap-2 hover:bg-secondary transition-colors p-1 px-2 rounded-md">
                <Settings className="w-4 h-4" strokeWidth={2} />
                <span>General</span>
              </div>
            </div>
            <div className="h-[1px] w-[90%] mx-auto mt-3 bg-border" />
            <div className="pl-4 px-6 mt-4 space-y-1">
              <div className="text-foreground/70 flex items-center gap-2 hover:bg-secondary transition-colors p-1 px-2 rounded-md">
                <NotepadText className="w-4 h-4" strokeWidth={2} />
                <span>Posts & Drafts</span>
              </div>
              <div className="text-foreground/70 flex items-center gap-2 hover:bg-secondary transition-colors p-1 px-2 rounded-md">
                <Tags className="w-4 h-4" strokeWidth={2} />
                <span>Categories</span>
              </div>
            </div>
            <div className="mt-auto px-6">
              <Button
                variant="outline"
                className="w-full h-10 text-foreground/70 gap-3"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Blog</span>
              </Button>
            </div>
          </aside>
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
}
