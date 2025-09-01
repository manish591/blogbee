import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '../components/blog-layout';
import { getBlogBySlug } from '../dal/get-blog-by-slug';
import { getPosts } from '../dal/get-posts';
import { ArchivePostCard } from './archive-post-card';

export default async function BlogArchivesPage({
  params,
}: Readonly<{ params: Promise<{ subdomain: string }> }>) {
  const subdomain = (await params).subdomain;
  const blogData = await getBlogBySlug(subdomain);
  const postsData = await getPosts(subdomain);

  return (
    <Layout blogData={blogData}>
      <div className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex-1">
          <div className="mb-12">
            <h1 className="text-4xl font-bold leading-tight">
              Archives ({postsData.totalItems})
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y">
          {postsData.items.map((post) => {
            return <ArchivePostCard key={post._id} postData={post} />;
          })}
        </div>
        {postsData.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-7 text-sm"
                disabled={postsData.currentPage === 1}
              >
                <ChevronLeft className="mb-[1px]" />
                Previous
              </Button>
              <p className="text-sm text-foreground/60">
                Page {postsData.currentPage} of {postsData.totalPages}
              </p>
              <Button
                variant="ghost"
                className="h-7 text-sm"
                disabled={postsData.currentPage === postsData.totalPages}
              >
                Next <ChevronRight />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
