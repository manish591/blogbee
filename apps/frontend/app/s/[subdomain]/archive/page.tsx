import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArchivePostCard } from './archive-post-card';

export default function BlogArchivesPage() {
  return (
    <div className="py-24 max-w-7xl mx-auto px-8">
      <div className="flex-1">
        <div className="mb-12">
          <h1 className="text-4xl font-bold leading-tight">Archives (86)</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y">
        <ArchivePostCard />
        <ArchivePostCard />
        <ArchivePostCard />
        <ArchivePostCard />
        <ArchivePostCard />
      </div>
      <div className="mt-12 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-7 text-sm">
            <ChevronLeft className="mb-[1px]" />
            Previous
          </Button>
          <p className="text-sm text-foreground/60">Page 1 of 86</p>
          <Button variant="ghost" className="h-7 text-sm">
            Next <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
