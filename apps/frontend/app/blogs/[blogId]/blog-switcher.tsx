import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { Check, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAllBlogs } from '../dal/get-all-blogs';

export async function BlogsSwitcher({
  selectedBlogId,
}: Readonly<{ selectedBlogId: string }>) {
  const allBlogs = await getAllBlogs({ limit: 5, sort: 'latest' });
  const selectedBlog = allBlogs.items.find(
    (blog) => blog._id === selectedBlogId,
  );

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src="https://adhhd.png" />
        <AvatarFallback className="bg-accent border text-sm capitalize">
          {selectedBlog?.name[0]}
        </AvatarFallback>
      </Avatar>
      <span className="text-base font-medium capitalize">
        {selectedBlog?.name}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="hover:bg-secondary h-7 w-7 rounded-[50px] flex items-center justify-center p-1 mt-[2px]">
            <ChevronsUpDown className="w-4 h-4 text-foreground/70" />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 shadow-sm p-0" align="center">
          <DropdownMenuLabel className="text-foreground/70 text-sm pt-3 px-3">
            Blogs
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {allBlogs.items.map((blog) => {
              return (
                <DropdownMenuItem
                  key={blog._id}
                  className="cursor-pointer px-3"
                  asChild
                >
                  <Link href={`/blogs/${blog._id}`}>
                    <div className="flex items-center gap-2 w-full">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src="https://randon.png" />
                        <AvatarFallback className="bg-secondary border text-xs">
                          <span className="mt-[1px] capitalize">
                            {blog.name[0]}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                      <span className="capitalize">{blog?.name}</span>
                      {blog._id === selectedBlog?._id && (
                        <Check className="ml-auto text-green-500" />
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator className="h-[1px] mt-2 bg-border" />
            <DropdownMenuItem
              asChild
              className="cursor-pointer text-center block"
            >
              <Link href="/blogs/all" className="text-center">
                View all blogs
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
