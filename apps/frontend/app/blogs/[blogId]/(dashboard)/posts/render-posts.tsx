import { FileText } from 'lucide-react';
import { getAllPosts } from '@/app/blogs/dal/get-all-posts';
import { AddNewPostButton } from './add-new-post-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostsGrid } from './posts-grid';

export async function RenderPosts({
  blogId,
  query,
}: Readonly<{ blogId: string; query: string }>) {
  const postData = await getAllPosts(blogId, {
    query,
  });

  return (
    <>
      {postData.items.length < 1 ? (
        <div className="flex py-10 justify-center p-8">
          <div className="border-0 w-full max-w-md shadow-none">
            <div className="flex flex-col items-center text-center p-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Posts not found</h2>
              <p className="text-foreground/70 mb-6 leading-[1.5] max-w-[70%] mx-auto">
                You haven't created any blog posts yet. Create your first site
                below.
              </p>
              <span className="loading loading-ring loading-md"></span>
              <AddNewPostButton blogId={blogId}>
                Create First Draft Post
              </AddNewPostButton>
            </div>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="published" className="w-full">
          <TabsList className="p-0 mb-3 border-b w-full items-end justify-start bg-transparent rounded-none">
            <div className="flex items-center gap-6">
              <TabsTrigger
                value="published"
                className="data-[state=active]:bg-transparent p-0 py-1.5 border-0 rounded-none border-b-2 data-[state=active]:border-neutral-300 data-[state=active]:shadow-none px-[1px] text-foreground/70"
              >
                Published
              </TabsTrigger>
              <TabsTrigger
                value="draft"
                className="data-[state=active]:bg-transparent p-0 py-1.5 border-0 rounded-none border-b-2 data-[state=active]:border-neutral-300 data-[state=active]:shadow-none px-[1px] text-foreground/70"
              >
                Draft
              </TabsTrigger>
              <TabsTrigger
                value="deleted"
                className="data-[state=active]:bg-transparent p-0 py-1.5 border-0 rounded-none border-b-2 data-[state=active]:border-neutral-300 data-[state=active]:shadow-none px-[1px] text-foreground/70"
              >
                Archived
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent value="published">
            <div className="bg-card rounded-lg border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30">
                <div className="col-span-6 font-medium text-foreground">
                  Title
                </div>
                <div className="col-span-4 font-medium text-foreground">
                  Slug
                </div>
                <div className="col-span-2 font-medium text-foreground text-right">
                  Actions
                </div>
              </div>
              <PostsGrid postData={postData.items} />
            </div>
          </TabsContent>
          <TabsContent value="draft">
            <div className="bg-card rounded-lg border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30">
                <div className="col-span-6 font-medium text-foreground">
                  Title
                </div>
                <div className="col-span-4 font-medium text-foreground">
                  Slug
                </div>
                <div className="col-span-2 font-medium text-foreground text-right">
                  Actions
                </div>
              </div>
              <PostsGrid postData={postData.items} />
            </div>
          </TabsContent>
          <TabsContent value="deleted">
            <div className="bg-card rounded-lg border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30">
                <div className="col-span-6 font-medium text-foreground">
                  Title
                </div>
                <div className="col-span-4 font-medium text-foreground">
                  Slug
                </div>
                <div className="col-span-2 font-medium text-foreground text-right">
                  Actions
                </div>
              </div>
              <PostsGrid postData={postData.items} />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
