import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AddNewPostButton } from './add-new-post-button';
import { PostsFilters } from './posts-filters';
import { PostsSearchInput } from './posts-search-input';
import { RenderPosts } from './render-posts';

export default async function BlogDashboardPostsPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ blogId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const blogId = (await params).blogId;
  const queryParams = await searchParams;

  const query = (queryParams.query ?? '') as string;

  return (
    <main className="py-3 px-6 min-h-screen">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/blogs/${blogId}`}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Posts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-4xl px-16 mx-auto">
        <div>
          <div className="pt-8 pb-4">
            <div className="pb-6">
              <h1 className="text-3xl font-semibold">Posts & Drafts</h1>
              <p className="text-foreground/70 mt-2">
                Your posts status will show here
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4 mb-3">
              <PostsSearchInput />
              <PostsFilters />
              <AddNewPostButton blogId={blogId}>
                <span>New Draft</span>
              </AddNewPostButton>
            </div>
            <RenderPosts blogId={blogId} query={query} />
          </div>
        </div>
      </div>
    </main>
  );
}
