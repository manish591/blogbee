import { BlogCard, type TBlogData } from '@/app/blogs/all/blog-card';
import { cn } from '@/lib/utils';

export function BlogsGrid({
  blogsData,
  showListLayout,
}: Readonly<{ blogsData: TBlogData[]; showListLayout?: boolean }>) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
        showListLayout &&
          'grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-0 border rounded-md bg-background',
      )}
    >
      {blogsData.map((blog) => (
        <BlogCard key={blog.id} data={blog} showListView={showListLayout} />
      ))}
    </div>
  );
}
