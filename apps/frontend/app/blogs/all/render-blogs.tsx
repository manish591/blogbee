import { FileText, Plus } from 'lucide-react';
import { BlogCard } from '@/app/blogs/all/blog-card';
import { getAllBlogs } from '@/app/blogs/dal/get-all-blogs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type RenderBlogsProps = {
  layout: string;
  query: string;
  page: number;
  limit: number;
  sort: string;
};

export async function RenderBlogs({
  layout,
  query,
  page,
  limit,
  sort,
}: Readonly<RenderBlogsProps>) {
  const blogsData = await getAllBlogs({
    query,
    page,
    limit,
    sort,
  });

  return (
    <>
      {blogsData.items.length < 1 ? (
        <div className="flex py-20 justify-center min-h-screen p-8">
          <div className="border-0 w-full max-w-md shadow-none">
            <div className="flex flex-col items-center text-center p-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-semibold mb-3">Blogs not found</h2>
              <p className="text-foreground/70 mb-6 leading-[1.5] max-w-[70%] mx-auto">
                You haven't created any blog posts yet. Create your first site
                below.
              </p>
              <span className="loading loading-ring loading-md"></span>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create your first blog
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen">
          <div
            className={cn(
              'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
              layout === 'list' &&
                'grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-0 border rounded-md bg-background',
            )}
          >
            {blogsData.items.map((blog) => (
              <BlogCard
                key={blog._id}
                data={blog}
                showListView={layout === 'list'}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
