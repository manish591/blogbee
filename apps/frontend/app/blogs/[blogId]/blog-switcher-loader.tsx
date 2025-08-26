import { Skeleton } from '@/components/ui/skeleton';

export function BlogSwitcherLoader() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="bg-accent/50 h-8 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="bg-accent/50 h-2 w-[200px]" />
        <Skeleton className="bg-accent/50 h-2 w-[150px]" />
      </div>
    </div>
  );
}
