import { BarChart3, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface TBlogData {
  id: number;
  name: string;
  url: string;
  posts: number;
  lastUpdated: string;
}

export function BlogCard({
  data,
  showListView,
}: Readonly<{
  data: TBlogData;
  showListView?: boolean;
}>) {
  return (
    <Card
      key={data.id}
      className={cn(
        'bg-background shadow-none',
        showListView &&
          'rounded-none bg-transparent border-b border-t-0 border-r-0 border-l-0 last:border-none py-4',
      )}
    >
      <CardContent
        className={cn(
          'px-6',
          showListView && 'grid grid-cols-[35%_1fr_max-content]',
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'mb-4 flex items-start justify-between',
              showListView && 'mb-0',
            )}
          >
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-secondary">
                {data.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className={cn('mb-4', showListView && 'mb-0')}>
            <h3 className="font-medium">{data.name}</h3>
            <p className="text-sm text-foreground/50">{data.url}</p>
          </div>
        </div>
        <div className={cn('mb-8 text-sm', showListView && 'mb-0')}>
          <p className="text-foreground/80">{data.posts} posts</p>
          <p className="text-foreground/50">
            Last updated on {data.lastUpdated}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <ExternalLink className="mr-2 h-3 w-3" />
            Go to blog
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <BarChart3 className="mr-2 h-3 w-3" />
            Blog dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
