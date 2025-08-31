import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PostCard } from './components/post-card';
import { getBlogBySlug } from './dal/get-blog-by-slug';

export default async function BlogHomePage({
  params,
}: Readonly<{ params: Promise<{ subdomain: string }> }>) {
  const subdomain = (await params).subdomain;
  const blogDetails = await getBlogBySlug(subdomain);

  return (
    <div className="py-24 max-w-7xl mx-auto px-8">
      <div className="flex-1">
        <div className="mb-12">
          <h1 className="text-5xl font-bold leading-tight capitalize">
            The {blogDetails?.blog.name} Blog
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-12">
        <div>
          <div className="space-y-14">
            {blogDetails?.posts && blogDetails.posts.length > 0 && (
              <PostCard postData={blogDetails.posts[0]} isFeatured />
            )}
            {blogDetails?.posts.slice(1).map((post) => {
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
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-foreground/70 hover:text-foreground"
                >
                  All
                </Link>
              </li>
              {blogDetails?.categories.map((category) => {
                return (
                  <li key={category._id}>
                    <Link
                      href={`/categories/${category.name}`}
                      className="text-sm text-foreground/70 hover:text-foreground capitalize"
                    >
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
