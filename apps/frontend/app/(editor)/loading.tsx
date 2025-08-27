import { Skeleton } from '@/components/ui/skeleton';

export default function PostsEditorLoadingPage() {
  return (
    <main className="py-10 px-6">
      <div className="max-w-4xl px-16 mx-auto">
        <div>
          <div className="py-12">
            <div className="flex items-center space-x-4">
              <Skeleton className="bg-accent/50 h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="bg-accent/50 h-4 w-[250px]" />
                <Skeleton className="bg-accent/50 h-4 w-[200px]" />
              </div>
            </div>
          </div>
          <div className="pt-6 grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-3">
              <Skeleton className="bg-accent/50 h-[150px] w-[100%] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="bg-accent/50 h-4 w-[90%]" />
                <Skeleton className="bg-accent/50 h-4 w-[85%]" />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="bg-accent/50 h-[150px] w-[100%] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="bg-accent/50 h-4 w-[90%]" />
                <Skeleton className="bg-accent/50 h-4 w-[85%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
