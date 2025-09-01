import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '../../components/blog-layout';
import { CategoriesList } from '../../components/categories-list';
import { PostCard } from '../../components/post-card';
import { getBlogBySlug } from '../../dal/get-blog-by-slug';
import { getPosts } from '../../dal/get-posts';
import { getCategories } from '../../dal/get-categories';

export default async function PostCategoriesPage({
  params,
}: Readonly<{ params: Promise<{ subdomain: string; slug: string }> }>) {
  const subdomain = (await params).subdomain;
  const categorySlug = (await params).slug;
  const blogData = await getBlogBySlug(subdomain);
  const postsData = await getPosts(subdomain, {
    category: categorySlug,
  });
  const categoriesData = await getCategories(subdomain);

  return (
    <Layout blogData={blogData}>
      <div className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex-1">
          <div className="mb-12">
            <h1 className="text-4xl font-bold leading-tight capitalize">
              {categorySlug}
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-12">
          <div>
            <div className="space-y-10">
              {postsData.items.map((post) => {
                return <PostCard key={post._id} postData={post} />;
              })}
            </div>
            {postsData.items.length > 0 ? (
              <div className="flex items-center justify-center mt-10">
                <Button variant="outline" className="h-7 text-[0.8rem">
                  Load more
                  <ArrowRight />
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-xl text-foreground/70">Nothing here yet!</p>
              </div>
            )}
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
