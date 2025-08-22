import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function ArchivePostCard() {
  return (
    <div className="hover:bg-secondary/40 px-4 py-4 ml-[-16px] rounded-md">
      <div className="grid grid-cols-[200px_1fr_max-content] items-center">
        <time className="text-foreground/60">Aug 1, 2025</time>
        <h2 className="text-xl font-medium">
          Building AI Knowledge Graph Using Graphiti & Neo4j
        </h2>
        <Button
          variant="ghost"
          className="h-7 text-sm hover:bg-transparent hover:text-foreground"
        >
          Read more <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
