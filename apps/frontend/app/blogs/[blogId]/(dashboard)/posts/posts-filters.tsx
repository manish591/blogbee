import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function PostsFilters() {
  return (
    <Button variant="outline" className="rounded-md px-6 bg-transparent">
      <Filter className="w-4 h-4 mr-2" />
      Filter
    </Button>
  );
}
