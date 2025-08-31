import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export async function PostSearch() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="top-[15%] translate-y-0 p-0 gap-0"
      >
        <DialogHeader className="p-4 py-3">
          <div className="flex items-center justify-between">
            <Search className="w-4 h-4 mb-[2px]" />
            <Input
              placeholder="Search posts"
              className="border-0 focus-visible:ring-[0px]"
            />
          </div>
        </DialogHeader>
        <div className="border-t max-h-[400px] overflow-auto">
          <div className="px-4 py-2">
            <p className="text-foreground/50 text-xs font-medium uppercase">
              Posts
            </p>
          </div>
          <div>
            <div className="px-4 py-2 hover:bg-secondary/60">
              <h4 className="font-medium">
                Start here for a quick overview of everything you need to know
              </h4>
              <p className="text-sm mt-1 text-foreground/50">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
                esse tempore quae, sint minus molestiae incidunt eum culpa quas
                ab?
              </p>
            </div>
            <div className="px-4 py-2 hover:bg-secondary/60">
              <h4 className="font-medium">
                Setting up apps and custom integrations
              </h4>
              <p className="text-sm mt-1 text-foreground/50">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
                esse tempore quae, sint minus molestiae incidunt eum culpa quas
                ab?
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
