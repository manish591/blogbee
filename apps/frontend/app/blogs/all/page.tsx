import {
  BarChart3,
  ChevronDown,
  ExternalLink,
  LayoutGrid,
  List,
  ListFilter,
  Plus,
  Search,
  Slash,
} from 'lucide-react';
import { Footer } from '@/components/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Header,
  Logo,
  Navbar,
  ProfileAvatar,
  ProfileDropdown,
} from '@/components/header';

const sites = [
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

export default function AllBlogPage() {
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
        <div className="space-y-8 py-6 pb-16">
          <div className="max-w-[1080px] mx-auto space-y-8">
            <section className="flex items-center gap-4">
              <div className="flex flex-1 items-center">
                <div className="flex-1 relative w-full border rounded-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search Blogs..."
                    className="h-10 pl-10 bg-background border-none w-full shadow-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <ListFilter className="h-4 w-4" />
                </Button>
                <div className="border p-1 flex items-center h-10 rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-secondary h-8 w-8"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-transparent"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-10">
                      Add New...
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>New Project</DropdownMenuItem>
                    <DropdownMenuItem>New Folder</DropdownMenuItem>
                    <DropdownMenuItem>Import Project</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </section>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-2 border-dashed bg-background hover:border-gray-400 transition-colors cursor-pointer shadow-none">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed">
                    <Plus className="h-6 w-6 text-foreground/40" />
                  </div>
                  <h3 className="font-medium">Create new blog</h3>
                  <p className="text-sm text-foreground/70">
                    Give your blog editor and start creating
                  </p>
                </CardContent>
              </Card>
              {sites.map((site) => (
                <Card key={site.id} className="bg-background shadow-none">
                  <CardContent className="px-6">
                    <div className="flex items-center justify-between">
                      <div className="mb-4">
                        <h3 className="font-medium">{site.name}</h3>
                        <p className="text-sm text-foreground/50">{site.url}</p>
                      </div>
                      <div className="mb-4 flex items-start justify-between">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-secondary">
                            {site.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <div className="mb-8 text-sm text-foreground/70">
                      <p>{site.posts} posts</p>
                      <p>Last updated on {site.lastUpdated}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Go to blog
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                      >
                        <BarChart3 className="mr-2 h-3 w-3" />
                        Blog dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
