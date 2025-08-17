import { ExternalLink, BarChart3 } from 'lucide-react';
import { Marquee } from '@/components/magicui/marquee';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

export function HeroMarquee() {
  return (
    <div className="relative flex h-full w-full flex-row items-center justify-center overflow-hidden">
      <Marquee pauseOnHover vertical className="[--duration:30s]">
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
      </Marquee>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}
