import { getAllPosts } from '@/app/blogs/dal/get-all-posts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostsGrid } from './posts-grid';

export async function RenderPosts({
  blogId,
  query,
}: Readonly<{ blogId: string; query: string }>) {
  const postData = await getAllPosts(blogId, {
    query,
  });

  const draftPosts = postData.items.filter((post) => post.postStatus === 0);
  const publishedPosts = postData.items.filter((post) => post.postStatus === 1);
  const deletedPosts = postData.items.filter((post) => post.postStatus === 2);

  return (
    <Tabs defaultValue="published" className="w-full">
      <TabsList className="p-0 mb-3 border-b w-full items-end justify-start bg-transparent rounded-none">
        <div className="flex items-center gap-6">
          <TabsTrigger
            value="published"
            className="data-[state=active]:bg-transparent p-0 py-1.5 border-0 rounded-none border-b-2 data-[state=active]:border-neutral-300 data-[state=active]:shadow-none px-[1px] text-foreground/70"
          >
            Published ({publishedPosts.length})
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="data-[state=active]:bg-transparent p-0 py-1.5 border-0 rounded-none border-b-2 data-[state=active]:border-neutral-300 data-[state=active]:shadow-none px-[1px] text-foreground/70"
          >
            Draft ({draftPosts.length})
          </TabsTrigger>
          <TabsTrigger
            value="deleted"
            className="data-[state=active]:bg-transparent p-0 py-1.5 border-0 rounded-none border-b-2 data-[state=active]:border-neutral-300 data-[state=active]:shadow-none px-[1px] text-foreground/70"
          >
            Deleted ({deletedPosts.length})
          </TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="published">
        <div className="bg-card rounded-lg border">
          <PostsGrid postData={publishedPosts} />
        </div>
      </TabsContent>
      <TabsContent value="draft">
        <div className="bg-card rounded-lg border">
          <PostsGrid postData={draftPosts} />
        </div>
      </TabsContent>
      <TabsContent value="deleted">
        <div className="bg-card rounded-lg border">
          <PostsGrid postData={deletedPosts} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
