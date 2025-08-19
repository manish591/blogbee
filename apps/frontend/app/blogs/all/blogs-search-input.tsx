import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function BlogsSearchInput() {
  return (
    <div className="flex-1 relative w-full border rounded-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search Blogs..."
        className="h-10 pl-10 bg-background border-none w-full shadow-none"
      />
    </div>
  );
}
