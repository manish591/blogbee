import {
  BarChart3,
  ExternalLink,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const sites = [
  {
    id: 1,
    name: 'Personal blog',
    url: 'personal.site',
    posts: 15,
    lastUpdated: '29 Nov 2022',
    icon: 'P',
    iconBg: 'bg-purple-500',
  },
  {
    id: 2,
    name: 'Feather blog',
    url: 'feather.so/blog',
    posts: 18,
    lastUpdated: '17 Nov 2022',
    icon: '⚡',
    iconBg: 'bg-green-500',
  },
  {
    id: 3,
    name: 'My Journal',
    url: 'my-journal.blog',
    posts: 12,
    lastUpdated: '17 Oct 2022',
    icon: '📝',
    iconBg: 'bg-blue-500',
  },
  {
    id: 4,
    name: 'Travel Niche Blog',
    url: 'travel-niche.com',
    posts: 26,
    lastUpdated: '23 Oct 2022',
    icon: '✈️',
    iconBg: 'bg-purple-600',
  },
  {
    id: 5,
    name: 'Notion CMS Blog',
    url: 'notion-cms.blog',
    posts: 17,
    lastUpdated: '1 Sep 2022',
    icon: 'N',
    iconBg: 'bg-blue-600',
  },
  {
    id: 6,
    name: 'Finance Blog',
    url: 'finance-feather.blog',
    posts: 7,
    lastUpdated: '4 Aug 2022',
    icon: '$',
    iconBg: 'bg-green-600',
  },
  {
    id: 7,
    name: 'Community Blog',
    url: 'community-feather.so',
    posts: 4,
    lastUpdated: '16 Jul 2022',
    icon: '👥',
    iconBg: 'bg-gray-800',
  },
  {
    id: 8,
    name: 'Notion Store',
    url: 'notion.store',
    posts: 8,
    lastUpdated: '10 Apr 2022',
    icon: '🛍️',
    iconBg: 'bg-purple-700',
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Sites</h1>
            <p className="text-sm text-gray-600">
              Keep track of all your feather sites here...
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search sites" className="w-64 pl-10" />
          </div>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Create New Site Card */}
          <Card className="border-2 border-dashed border-gray-300 bg-white hover:border-gray-400 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-gray-300">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900">Create new blog</h3>
              <p className="text-sm text-gray-500">
                Give your blog editor and start creating
              </p>
            </CardContent>
          </Card>

          {/* Site Cards */}
          {sites.map((site) => (
            <Card
              key={site.id}
              className="bg-white hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-medium ${site.iconBg}`}
                  >
                    {site.icon}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit site</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-900">{site.name}</h3>
                  <p className="text-sm text-gray-500">{site.url}</p>
                </div>

                <div className="mb-4 text-sm text-gray-600">
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
  );
}
