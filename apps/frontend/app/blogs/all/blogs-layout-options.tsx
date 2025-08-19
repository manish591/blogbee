import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BlogLayoutOptions() {
  return (
    <div className="border p-1 flex items-center h-10 rounded-md">
      <Button variant="ghost" size="icon" className="bg-secondary h-8 w-8">
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
  );
}
