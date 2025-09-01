import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Layout } from './components/blog-layout';
import { CategoriesList } from './components/categories-list';
import { PostCard } from './components/post-card';
import { getBlogBySlug } from './dal/get-blog-by-slug';
import { getPosts } from './dal/get-posts';
import { getCategories } from './dal/get-categories';

export default async function BlogHomePage({
  params,
}: Readonly<{ params: Promise<{ subdomain: string }> }>) {
  const subdomain = (await params).subdomain;
  const blogData = await getBlogBySlug(subdomain);
  const postsData = await getPosts(subdomain);
  const categoriesData = await getCategories(subdomain);

  return (
    <Layout blogData={blogData}>
      <div className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex-1">
          <div className="mb-12">
            <h1 className="text-5xl font-bold leading-tight capitalize">
              The {blogData.name} Blog
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-12">
          <div>
            <div className="space-y-14">
              {postsData.items.length > 0 && (
                <PostCard postData={postsData.items[0]} isFeatured />
              )}
              {postsData.items.slice(1).map((post) => {
                return <PostCard key={post._id} postData={post} />;
              })}
            </div>
            <div className="flex items-center justify-center mt-10">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                asChild
              >
                <Link href="/archive">
                  View more
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
          <aside className="w-64 space-y-8 py-2">
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <CategoriesList categoriesData={categoriesData} />
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
