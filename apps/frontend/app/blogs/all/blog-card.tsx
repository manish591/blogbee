import { BarChart3, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BlogData } from '@/app/blogs/dal/get-all-blogs';
import Link from 'next/link';
import { convertDateToReadableFormat } from '@/lib/date';

export function BlogCard({
  data,
  showListView,
}: Readonly<{
  data: BlogData;
  showListView?: boolean;
}>) {
  return (
    <Card
      key={data._id}
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
            <h3 className="font-medium leading-[1.1]">{data.name}</h3>
            <Link
              href={`https://${data.slug}.blogbee.site`}
              className="text-sm text-foreground/50 hover:underline"
            >
              {data.slug}.blogbee.site
            </Link>
          </div>
        </div>
        <div className={cn('mb-8 text-sm', showListView && 'mb-0')}>
          <p className="text-foreground/80">10 posts</p>
          <p className="text-foreground/50">
            Last updated on{' '}
            {convertDateToReadableFormat(new Date(data.updatedAt))}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            asChild
          >
            <Link href={`https://${data.slug}.blogbee.site`}>
              <ExternalLink className="mr-2 h-3 w-3" />
              Go to blog
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            asChild
          >
            <Link href={`/blogs/${data._id}`}>
              <BarChart3 className="mr-2 h-3 w-3" />
              Blog dashboard
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
