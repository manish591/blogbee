import { Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function BlogDashboardOverviewPage() {
  return (
    <div>
      <div className="py-8">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-semibold">Overview</h1>
          <p className="text-foreground/70 mt-2">
            Learn more about your new dashboard and get started
          </p>
        </div>
      </div>
      <div className="space-y-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-medium text-foreground">
              Your blog stats
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4 px-6 border rounded-md shadow-none gap-2">
              <div className="text-2xl font-semibold text-foreground">9</div>
              <div className="text-sm text-muted-foreground">Total posts</div>
            </Card>
            <Card className="p-4 px-6 border rounded-md shadow-none gap-2">
              <div className="text-2xl font-semibold text-foreground">5</div>
              <div className="text-sm text-muted-foreground">Draft Posts</div>
            </Card>
            <Card className="p-4 px-6 border rounded-md shadow-none gap-2">
              <div className="text-2xl font-semibold text-foreground">4</div>
              <div className="text-sm text-muted-foreground">
                Published Posts
              </div>
            </Card>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">
            Quick links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 cursor-pointer shadow-none hover:border-neutral-400">
              <CardContent className="p-0">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Pencil className="w-4 h-4 text-foreground/70" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      Write a post
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Share your thoughts with the community.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
